'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-curly-component-invocation': {
      allow: ['has-flag-value', 'is-flag-enabled', 'get-flag-value'],
    },
  },
};
