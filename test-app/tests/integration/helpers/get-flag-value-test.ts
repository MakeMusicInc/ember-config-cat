import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupConfigCat, TestContext } from 'ember-config-cat/test-support';

module('Integration | Helper | get-flag-value', function (hooks) {
  setupRenderingTest(hooks);
  setupConfigCat(hooks);

  test('it does not render the flag value if it does not exist', async function (assert) {
    this.set('key', 'textSetting');

    await render(hbs`<p>{{get-flag-value key=this.key}}</p>`);

    assert.dom('p').hasNoText();
  });

  test('it renders the value', async function (this: TestContext, assert) {
    this.withFlag('textSetting', 'foo');
    this.set('key', 'textSetting');

    await render(hbs`<p>{{get-flag-value key=this.key}}</p>`);

    assert.dom('p').hasText('foo');
  });
});
