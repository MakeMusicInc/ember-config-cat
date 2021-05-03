# ember-config-cat

![Build](https://github.com/MakeMusicInc/ember-config-cat/actions/workflows/ci.yml/badge.svg?branch=main)

⚠️ This addon is still under development.

This addon includes a service which wraps a [ConfigCat](https://configcat.com/) client and aims at easing any feature flagging in your applications.

## Feature set/TODO

- [ ] A service self-injecting in routes and controllers, in charge of creating the ConfigCat client and to observe feature-flags changes
- [ ] Adding an auto-start option (in case you want to user authentication to be done be initializing and fetching flags)
- [ ] Opinionated: all feature-flags are fetched at the same time
- [ ] Opinionated: the same user traits will be used during the session
- [ ] Local/offline mode
- [ ] Ability to provide default values for feature-flags
- [ ] Template Helper
- [ ] Test Helper

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-config-cat
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
