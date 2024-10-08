import Service from '@ember/service';
import {
  IJSAutoPollOptions,
  IJSLazyLoadingOptions,
  IJSManualPollOptions,
  createConsoleLogger,
} from 'configcat-js';
import {
  createClientWithAutoPoll,
  createClientWithLazyLoad,
  createClientWithManualPoll,
} from '../utils/remote-client.ts';
import { createLocalClient } from '../utils/local-client.ts';
import { tracked } from '@glimmer/tracking';
import { IConfigCatClient, DataGovernance, LogLevel } from 'configcat-common';
import { getOwner } from '@ember/application';

export enum PollModes {
  auto = 'auto',
  lazy = 'lazy',
  manual = 'manual',
}

export interface TargetUser {
  identifier: string;
  email?: string;
  country?: string;
  custom?: Record<string, string>;
}

type PollMode = `${PollModes}`;

interface EnvOptions {
  mode?: PollMode;
  local?: boolean;
  flags?: Flags;
  sdkKey?: string;
  requestTimeoutMs?: number;
  logLevel?: LogLevel;
  dataGovernance?: DataGovernance;
  maxInitWaitTimeSeconds?: number;
  pollIntervalSeconds?: number;
  cacheTimeToLiveSeconds?: number;
}

interface AddonOptions {
  mode: PollMode;
  local: boolean;
  flags: Flags;
  sdkKey?: string;
  options?: IJSAutoPollOptions | IJSLazyLoadingOptions | IJSManualPollOptions;
}

export type Flags = Record<string, boolean | number | string>;

export default class ConfigCat extends Service {
  #client?: Pick<
    IConfigCatClient,
    'dispose' | 'getAllValuesAsync' | 'forceRefreshAsync'
  >;
  #targetUser: TargetUser | undefined;

  @tracked flags: Flags = {};

  private getAddonOptions() {
    // @ts-ignore https://github.com/emberjs/ember.js/issues/19916
    const config = getOwner(this).resolveRegistration('config:environment');
    return config.emberConfigCat || {};
  }

  getAddonConfig(envOptions: EnvOptions): AddonOptions {
    const mode = envOptions.mode || PollModes.auto;
    const local = envOptions.local || !envOptions.sdkKey;
    const flags = envOptions.flags || {};
    const logLevel = envOptions.logLevel;
    const dataGovernance = envOptions.dataGovernance || DataGovernance.Global;

    const options = {
      ...(envOptions.requestTimeoutMs && {
        requestTimeoutMs: envOptions.requestTimeoutMs,
      }),
      dataGovernance,
      ...(envOptions.maxInitWaitTimeSeconds && {
        maxInitWaitTimeSeconds: envOptions.maxInitWaitTimeSeconds,
      }),
      ...(mode === PollModes.lazy &&
        envOptions.cacheTimeToLiveSeconds && {
          cacheTimeToLiveSeconds: envOptions.cacheTimeToLiveSeconds,
        }),
      ...(mode === PollModes.auto &&
        envOptions.pollIntervalSeconds && {
          pollIntervalSeconds: envOptions.pollIntervalSeconds,
        }),
      ...(logLevel && {
        logger: createConsoleLogger(logLevel),
      }),
    };

    return {
      sdkKey: envOptions.sdkKey,
      mode,
      local,
      flags,
      options,
    };
  }

  initClient(): Promise<void> | undefined {
    if (this.#client) {
      return;
    }

    const { mode, local, flags, sdkKey, options } = this.getAddonConfig(
      this.getAddonOptions(),
    );

    if (local || !sdkKey) {
      return this.initLocalClient(flags);
    }

    return this.initRemoteClient(mode, sdkKey, options);
  }

  private async initLocalClient(flags: Flags) {
    this.#client = createLocalClient(flags);
    await this.update();
  }

  private async initRemoteClient(
    mode: PollMode,
    sdkKey: string,
    options?: IJSAutoPollOptions | IJSLazyLoadingOptions | IJSManualPollOptions,
  ) {
    switch (mode) {
      case PollModes.lazy:
        this.#client = createClientWithLazyLoad(sdkKey, options);
        break;

      case PollModes.manual:
        this.#client = createClientWithManualPoll(sdkKey, options);
        await this.#client.forceRefreshAsync();
        break;

      case PollModes.auto:
      default:
        this.#client = createClientWithAutoPoll(sdkKey, {
          ...options,
          configChanged: () => this.update(),
        });
        break;
    }

    await this.update();
  }

  async identifyUser(user: TargetUser): Promise<void> {
    this.#targetUser = user;
    await this.initClient();
    await this.update();
  }

  dispose(): void {
    if (!this.#client) {
      return;
    }

    this.#client.dispose();
  }

  async update(): Promise<void> {
    if (!this.#client) {
      return;
    }

    const remoteValues = await this.#client.getAllValuesAsync(this.#targetUser);

    if (remoteValues.length <= 0) {
      return;
    }

    const newFlags = remoteValues.reduce(function (acc: Flags, current) {
      const { settingKey, settingValue } = current;
      acc[settingKey] = settingValue;
      return acc;
    }, {});

    this.flags = newFlags;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'config-cat': ConfigCat;
  }
}
