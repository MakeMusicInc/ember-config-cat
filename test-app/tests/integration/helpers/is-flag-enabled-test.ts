import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupConfigCat, TestContext } from 'ember-config-cat/test-support';

module('Integration | Helper | is-flag-enabled', function (hooks) {
  setupRenderingTest(hooks);
  setupConfigCat(hooks);

  test('it does not render the flag value if it does not exist', async function (assert) {
    this.set('key', 'awesomeFeatureFlag');

    await render(hbs`<p>
      {{#if (is-flag-enabled key=this.key)}}
        Enabled!
      {{else}}
        Disabled
      {{/if}}
    </p>`);

    assert.dom('p').hasText(`Disabled`);
  });

  test('it renders the value', async function (this: TestContext, assert) {
    this.withFlag('awesomeFeatureFlag', true);
    this.set('key', 'awesomeFeatureFlag');

    await render(hbs`<p>
      {{#if (is-flag-enabled key=this.key)}}
        Enabled!
      {{else}}
        Disabled
      {{/if}}
    </p>`);

    assert.dom('p').hasText(`Enabled!`);
  });
});
