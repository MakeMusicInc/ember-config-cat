'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },
  },

  config(_, appConfig) {
    const addonConfig = appConfig['emberConfigCat'];
    this.options['@embroider/macros'].setOwnConfig.configCatConfig = {
      ...addonConfig,
    };
    return this._super(...arguments);
  },
};
