import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupConfigCat, TestContext } from 'ember-config-cat/test-support';

module('Integration | Helper | has-flag-value', function (hooks) {
  setupRenderingTest(hooks);
  setupConfigCat(hooks);

  test('it does not render the flag value if it does not exist', async function (assert) {
    this.set('key', 'textSetting');
    this.set('value', 'foo');

    await render(hbs`<p>
      {{#if (has-flag-value key=this.key value=this.value)}}
        Equals 'foo'!
      {{else}}
        Does not equal 'foo'!
      {{/if}}
    </p>`);

    assert.dom('p').hasText(`Does not equal 'foo'!`);
  });

  test('it renders the value', async function (this: TestContext, assert) {
    this.withFlag('textSetting', 'foo');
    this.set('key', 'textSetting');
    this.set('value', 'foo');

    await render(hbs`<p>
      {{#if (has-flag-value key=this.key value=this.value)}}
        Equals 'foo'!
      {{else}}
        Does not equal 'foo'!
      {{/if}}
    </p>`);

    assert.dom('p').hasText(`Equals 'foo'!`);
  });
});
