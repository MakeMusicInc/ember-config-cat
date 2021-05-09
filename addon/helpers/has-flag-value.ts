import ConfigCatHelper from './-private/config-cat-helper';

export default class HasFlagValueHelper extends ConfigCatHelper {
  compute(
    _params: unknown[],
    { key, value }: { key: string; value: boolean | number | string }
  ): boolean {
    return this.configCat.flags[key] === value;
  }
}
