import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import ConfigCat from '../services/config-cat.ts';

export default class ConfigCatHelper extends Helper {
  @service configCat!: ConfigCat;

  // eslint-disable-next-line ember/no-observers
  onFlagUpdate = observer('configCat.flags', function (this: ConfigCatHelper) {
    this.recompute();
  });
}
