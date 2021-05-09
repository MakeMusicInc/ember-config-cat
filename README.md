# ember-config-cat

![Build](https://github.com/MakeMusicInc/ember-config-cat/actions/workflows/ci.yml/badge.svg?branch=main)

⚠️ This addon is still under development.

This addon includes a service which wraps a [ConfigCat](https://configcat.com/) client and aims at easing any feature flagging in your applications.

## Feature set

- [x] A service in charge of creating the ConfigCat client and to observe feature-flags changes
- [x] Adding an auto-start option (in case you want to user authentication to be done be initializing and fetching flags)
- [x] Opinionated: all feature-flags are fetched at the same time
- [x] Opinionated: the same user traits will be used during the session
- [x] Local mode
- [x] Test Helper
- [x] Template Helper

## TODO

- [ ] Ability to provide default values for feature-flags

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-config-cat
```

## Usage

### Options

```js
# environment.js

module.exports = function (environment) {
  let ENV = {
    emberConfigCat: {
      // your options goes here
    }
  };
};
```

| Option                   | Default    | Description                                                   | Links                                                                  |
| ------------------------ | ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `mode`                   | `'auto'`   | Polling mode: `'auto'`/`'lazy'`/`'manual'`                    | [🔗](https://configcat.com/docs/sdk-reference/js#polling-modes)        |
| `local`                  | `false`    | Enabling local mode: will only use default flag values        | -                                                                      |
| `flags`                  | -          | Default values for feature-flags                              | -                                                                      |
| `sdkKey`                 | –          | Your SDK Key                                                  | [🔗](https://app.configcat.com/sdkkey)                                 |
| `requestTimeoutMs`       | `30000`    | Amount of time the SDK waits before returning cached values   | [🔗](https://configcat.com/docs/sdk-reference/js#auto-polling-default) |
| `maxInitWaitTimeSeconds` | `5`        | Maximum waiting time between client init and config fetch     | [🔗](https://configcat.com/docs/sdk-reference/js#auto-polling-default) |
| `pollIntervalSeconds`    | `60`       | Polling interval                                              | [🔗](https://configcat.com/docs/sdk-reference/js#auto-polling-default) |
| `cacheTimeToLiveSeconds` | `60`       | Cache TTL                                                     | [🔗](https://configcat.com/docs/sdk-reference/js#lazy-loading)         |
| `dataGovernance`         | `'Global'` | Determine the CDN location of the data: `'Global'`/`'EuOnly'` | [🔗](https://configcat.com/docs/advanced/data-governance)              |

- `requestTimeoutMs` and `dataGovernance` are common polling options to the three available modes
- All default values except `mode`, `local` and `autoStart` are defined in the ConfigCat SDK
- You may define either `local` or `sdkKey` but the addon will fallback to `local` mode if no `sdkKey` is provided.

### Initializing the client

#### Without user identification

```js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhateverRoute extends Route {
  @service configCat;

  beforeModel() {
    return this.configCat.initClient();
  }
}
```

#### With user identification

A ConfigCat user object is made of four properties (identifier, email, country and custom): [structure](https://configcat.com/docs/advanced/user-object#user-objects-structure)
Calling `.identifyUser()` will initialize the client if needed.

```js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WhateverRoute extends Route {
  @service configCat;

  async model() {
    const user = this.authenticate();
    await this.configCat.identifyUser({
      identifier: user.id,
      email: user.email,
    });
  }
}
```

### Using feature-flag values

```js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WhateverComponent extends Component {
  @service configCat;

  get isEnabled() {
    return this.configCat.flags.isAwesomeFeatureEnabled;
  }
}
```

```hbs
{{#if this.isEnabled}}
  Enabled
{{else}}
  Disabled
{{/if}}
```

### Template helpers

| Name              | Parameters | Description                                                   |
| ----------------- | ---------- | ------------------------------------------------------------- |
| `is-flag-enabled` | key        | Checks if the flag is enabled                                 |
| `get-flag-value`  | key        | Gets the current flag value                                   |
| `has-flag-value`  | key, value | Compares the current flag value against a provided parameters |

### Clearing data

```js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WhateverComponent extends Component {
  @service configCat;

  @action onClear() {
    this.configCat.dispose();
  }
}
```

### Public methods and properties

| Name           | Type             | Description                                         |
| -------------- | ---------------- | --------------------------------------------------- |
| `flags`        | tracked property | Returns available feature-flags and values          |
| `identifyUser` | method           | Identifies user and update feature-flags values     |
| `update`       | method           | Updates feature-flags values                        |
| `dispose`      | method           | Releases everything related to the ConfigCat client |

## Testing

`ember-config-cat` comes with a couple of test-helpers:

```js
// ...
import { setupConfigCat, TestContext } from 'ember-config-cat/test-support';

module('...', function (hooks) {
  // ...
  setupConfigCat(hooks);

  test('...', async function (this: TestContext, assert) {
    // configuring one flag
    this.withFlag('featureA', true);

    // configuring several flags
    this.withFlags({ featureB: true, pricing: 10 });

    // ...
  });
});
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## References

We draw our inspiration from the `ember-launch-darkly` [addon](https://github.com/adopted-ember-addons/ember-launch-darkly)

## Docs

- [ConfigCat API](https://api.configcat.com/docs)
- Using ConfigCat in JavaScript [Documentation](https://configcat.com/docs/sdk-reference/js) - [SDK](https://github.com/configcat/js-sdk)

## License

This project is licensed under the [MIT License](LICENSE.md).
