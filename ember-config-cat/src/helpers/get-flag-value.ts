import ConfigCatHelper from '../utils/config-cat-helper.ts';

export default class GetFlagValueHelper extends ConfigCatHelper {
  compute(
    _params: unknown[],
    { key }: { key: string },
  ): string | boolean | number | undefined {
    return this.configCat.flags[key];
  }
}
