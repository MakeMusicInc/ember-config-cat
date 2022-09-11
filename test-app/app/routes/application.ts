import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ConfigCat } from 'ember-config-cat';
import RouterService from '@ember/routing/router-service';

export default class Application extends Route {
  @service declare configCat: ConfigCat;
  @service declare router: RouterService;

  async beforeModel() {
    await this.configCat.initClient();
    console.log('🏁', this.configCat.flags);
  }
}
