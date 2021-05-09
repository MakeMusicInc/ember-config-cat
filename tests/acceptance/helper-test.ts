import { module, test } from 'qunit';
import { visit, settled } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupConfigCat, TestContext } from 'ember-config-cat/test-support';

module('Acceptance | helper', function (hooks) {
  setupApplicationTest(hooks);
  setupConfigCat(hooks);

  test('helpers update after flag update', async function (this: TestContext, assert) {
    await visit('/');

    this.withFlags({
      isAwesomeFeatureEnabled: true,
      textsetting: 'not production',
      number: 40,
    });

    await settled();

    assert.dom('[data-test="is-flag-enabled"]').hasText('Hello, world!');
    assert.dom('[data-test="get-flag-value"]').hasText('40');
    assert.dom('[data-test="has-flag-value"]').hasText('Developing');

    this.withFlags({
      isAwesomeFeatureEnabled: false,
      textsetting: 'production',
      number: 30,
    });
    await settled();

    assert.dom('[data-test="is-flag-enabled"]').hasNoText();
    assert.dom('[data-test="get-flag-value"]').hasText('30');
    assert.dom('[data-test="has-flag-value"]').hasText('Production');
  });
});
