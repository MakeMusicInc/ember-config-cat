import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { createConsoleLogger } from 'configcat-js';
import ConfigCat from 'ember-config-cat/services/config-cat';
import { DataGovernance } from 'configcat-common';

module('Unit | Service | config-cat', function (hooks) {
  setupTest(hooks);

  test('it returns a config with a SDK key', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({ sdkKey: 'SDK_KEY' });
    assert.strictEqual(config.mode, 'auto');
  });

  test('it returns a config with a default mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({});
    assert.strictEqual(config.mode, 'auto');
  });

  test('it returns a config with the provided mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({ mode: 'lazy' });
    assert.strictEqual(config.mode, 'lazy');
  });

  test('it returns a config with the local mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({ sdkKey: 'SDK_KEY', local: true });
    assert.true(config.local);
  });

  test('it returns a config with the local mode when the SDK key is missing', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({});
    assert.true(config.local);
  });

  test('it returns a config with a default empty poll options config', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({});
    assert.deepEqual(config.options, {});
  });

  test('it returns a config with a filtered poll options config in lazy mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      mode: 'lazy',
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
      cacheTimeToLiveSeconds: 60,
      pollIntervalSeconds: 120,
    });

    assert.deepEqual(config.options, {
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
      cacheTimeToLiveSeconds: 60,
    });
  });

  test('it returns a config with a filtered poll options config in auto mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      mode: 'auto',
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
      cacheTimeToLiveSeconds: 60,
      pollIntervalSeconds: 120,
    });

    assert.deepEqual(config.options, {
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
      pollIntervalSeconds: 120,
    });
  });

  test('it returns a config with a filtered poll options config in manual mode', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      mode: 'manual',
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
      cacheTimeToLiveSeconds: 60,
      pollIntervalSeconds: 120,
    });

    assert.deepEqual(config.options, {
      requestTimeoutMs: 400,
      dataGovernance: DataGovernance.Global,
      maxInitWaitTimeSeconds: 300,
    });
  });

  test('it returns a config with a disabled logger', function (assert) {
    const logLevel = -1;
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      logLevel,
    });
    assert.deepEqual(config.options?.logger, createConsoleLogger(logLevel));
  });

  test('it returns a config with a logger set at info level', function (assert) {
    const logLevel = 3;
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      logLevel,
    });
    assert.deepEqual(config.options?.logger, createConsoleLogger(logLevel));
  });

  test('it returns a config with a logger set at warn level', function (assert) {
    const logLevel = 2;
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      logLevel,
    });
    assert.deepEqual(config.options?.logger, createConsoleLogger(logLevel));
  });

  test('it returns a config with a logger set at error level', function (assert) {
    const logLevel = 1;
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({
      logLevel,
    });
    assert.deepEqual(config.options?.logger, createConsoleLogger(logLevel));
  });

  test('it returns a config without logger', function (assert) {
    const service = this.owner.lookup('service:config-cat') as ConfigCat;
    const config = service.getAddonConfig({});
    assert.strictEqual(config.options?.logger, undefined);
  });
});
