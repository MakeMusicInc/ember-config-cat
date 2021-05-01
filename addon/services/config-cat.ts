import Service from '@ember/service';
import {
  IJSAutoPollOptions,
  IJSLazyLoadingOptions,
  IJSManualPollOptions,
  createClientWithAutoPoll,
  createClientWithLazyLoad,
  createClientWithManualPoll,
} from 'configcat-js';
import { tracked } from '@glimmer/tracking';
import { IConfigCatClient, DataGovernance } from 'configcat-common';
import { getOwner } from '@ember/application';

enum PollModes {
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
  sdkKey?: string;
  requestTimeoutMs?: number;
  dataGovernance?: DataGovernance;
  maxInitWaitTimeSeconds?: number;
  pollIntervalSeconds?: number;
  cacheTimeToLiveSeconds?: number;
}

interface AddonOptions {
  mode: PollMode;
  local: boolean;
  sdkKey?: string;
  options?: IJSAutoPollOptions | IJSLazyLoadingOptions | IJSManualPollOptions;
}

export default class ConfigCat extends Service {
  #client?: IConfigCatClient;
  #targetUser: TargetUser | undefined;

  @tracked flags: Record<string, boolean | number | string> = {};

  private getAddOptions() {
    const { emberConfigCat } = getOwner(this).resolveRegistration(
      'config:environment'
    );
    return emberConfigCat;
  }

  getAddonConfig(envOptions: EnvOptions): AddonOptions {
    const mode = envOptions.mode || PollModes.auto;

    const options = {
      ...(envOptions.requestTimeoutMs && {
        requestTimeoutMs: envOptions.requestTimeoutMs,
      }),
      ...(envOptions.dataGovernance && {
        dataGovernance: envOptions.dataGovernance,
      }),
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
    };

    return {
      sdkKey: envOptions.sdkKey,
      mode,
      local: envOptions.local || Boolean(envOptions.sdkKey),
      options,
    };
  }

  initClient(): Promise<void> | undefined {
    if (this.#client) {
      return;
    }

    const { mode, sdkKey, options } = this.getAddonConfig(this.getAddOptions());

    return this.initRemoteClient(mode, options, sdkKey);
  }

  private async initRemoteClient(
    mode: PollMode,
    options?: IJSAutoPollOptions | IJSLazyLoadingOptions | IJSManualPollOptions,
    sdkKey?: string
  ) {
    if (!sdkKey) {
      // until local mode is developed
      throw new Error('SDK Key missing');
    }

    switch (mode) {
      case PollModes.lazy:
        await this.initLazyClient(sdkKey, options);
        break;

      case PollModes.manual:
        await this.initManualClient(sdkKey, options);
        break;

      case PollModes.auto:
      default:
        await this.initAutoPollClient(sdkKey, options);
        break;
    }
  }

  private async initAutoPollClient(
    sdkKey: string,
    options?: IJSAutoPollOptions
  ) {
    this.#client = createClientWithAutoPoll(sdkKey, {
      ...options,
      configChanged: () => this.update(),
    });
  }

  private async initLazyClient(
    sdkKey: string,
    options?: IJSLazyLoadingOptions
  ) {
    this.#client = createClientWithLazyLoad(sdkKey, options);
    await this.update();
  }

  private async initManualClient(
    sdkKey: string,
    options?: IJSManualPollOptions
  ) {
    this.#client = createClientWithManualPoll(sdkKey, options);
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
    remoteValues.forEach(({ settingKey, settingValue }) => {
      this.flags[settingKey] = settingValue;
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'config-cat': ConfigCat;
  }
}
