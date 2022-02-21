'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['has-flag-value', 'is-flag-enabled', 'get-flag-value'],
    },
  },
};
