import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ConfigCat from 'ember-config-cat/services/config-cat';
import RouterService from '@ember/routing/router-service';

export default class Application extends Route {
  @service configCat!: ConfigCat;
  @service router!: RouterService;

  async beforeModel(): Promise<void> {
    await this.configCat.initClient();
    console.log('🏁', this.configCat.flags);
  }
}
