import { TestContext as BasicTestContext } from 'ember-test-helpers';
import Service from '@ember/service';

export type Flags = Record<string, boolean | number | string>;

export interface TestContext extends BasicTestContext {
  withFlag(key: string, value: unknown): void;
  withFlags(flags: Flags): void;
}

export function setupConfigCat(hooks: NestedHooks): void {
  hooks.beforeEach(function (this: TestContext) {
    this.owner.unregister('service:config-cat');
    this.owner.register(
      'service:config-cat',
      class MockConfigCat extends Service {
        flags: Flags = {};

        setFlag(key: string, value: boolean | number | string) {
          this.flags[key] = value;
        }

        setFlags(flags: Flags) {
          this.flags = {
            ...this.flags,
            ...flags,
          };
        }
      }
    );

    this.withFlag = (key: string, value: boolean | number | string) => {
      const service = this.owner.lookup('service:config-cat');
      service.setFlag(key, value);
    };

    this.withFlags = (flags: Flags) => {
      const service = this.owner.lookup('service:config-cat');
      service.setFlags(flags);
    };
  });
}
