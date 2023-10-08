import ConfigCatHelper from '../utils/config-cat-helper.ts';

export default class IsFlagEnabledHelper extends ConfigCatHelper {
  compute(_params: unknown[], { key }: { key: string }): boolean {
    return this.configCat.flags[key] === true;
  }
}
