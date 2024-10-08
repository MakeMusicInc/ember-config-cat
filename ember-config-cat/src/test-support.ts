import 'ember-qunit';
import { TestContext as BasicTestContext } from '@ember/test-helpers';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export type Flags = Record<string, boolean | number | string>;

export interface TestContext extends BasicTestContext {
  withFlag(key: string, value: unknown): void;
  withFlags(flags: Flags): void;
}

class MockConfigCat extends Service {
  @tracked flags: Flags = {};

  initClient() {
    return Promise.resolve();
  }

  identifyUser() {
    return Promise.resolve();
  }

  setFlag(key: string, value: boolean | number | string) {
    this.flags = {
      ...this.flags,
      [key]: value,
    };
  }

  setFlags(flags: Flags) {
    this.flags = {
      ...this.flags,
      ...flags,
    };
  }
}

export function setupConfigCat(hooks: NestedHooks): void {
  hooks.beforeEach(function (this: TestContext) {
    this.owner.register('service:config-cat', MockConfigCat);

    this.withFlag = (key: string, value: boolean | number | string) => {
      const service = this.owner.lookup(
        'service:config-cat',
      ) as unknown as MockConfigCat;
      service.setFlag(key, value);
    };

    this.withFlags = (flags: Flags) => {
      const service = this.owner.lookup(
        'service:config-cat',
      ) as unknown as MockConfigCat;
      service.setFlags(flags);
    };
  });
}
