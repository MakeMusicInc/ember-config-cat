import ConfigCatHelper from './-private/config-cat-helper';

export default class IsFlagEnabledHelper extends ConfigCatHelper {
  compute(_params: unknown[], { key }: { key: string }): boolean {
    return this.configCat.flags[key] === true;
  }
}
