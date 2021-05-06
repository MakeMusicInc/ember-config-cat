import { Flags } from 'ember-config-cat/services/config-cat';

class LocalFactory {
  #flags: {
    settingKey: string;
    settingValue: string | number | boolean;
  }[];

  constructor(flags: Flags) {
    this.#flags = [];
    for (const [key, value] of Object.entries(flags)) {
      this.#flags.push({
        settingKey: key,
        settingValue: value,
      });
    }
  }

  getAllValuesAsync() {
    return Promise.resolve(this.#flags);
  }

  forceRefreshAsync() {
    return Promise.resolve();
  }

  dispose() {
    return undefined;
  }
}

export function createLocalClient(flags: Flags): LocalFactory {
  return new LocalFactory(flags);
}
