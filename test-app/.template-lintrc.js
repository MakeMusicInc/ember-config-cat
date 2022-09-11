'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['get-flag-value', 'has-flag-value', 'is-flag-enabled'],
    },
  },
};
