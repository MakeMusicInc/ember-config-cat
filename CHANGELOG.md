# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2022-02-22

### Added

- Support Ember v4
- Breaking change: Supporting Ember 3.24 and higher
- Breaking change: Dropping Node 10
- Use ember-auto-import v2
- Add logLevel option

### Fixed

- Breaking change: DataGovernance incorrectly set and documented

### Changed

- Updated configcat-common to 4.6.2
- Updated configcat-js to 5.7.1

## [0.1.2] - 2021-10-01

### Fixed

- Rolling back changes on `ember-auto-import`
  - Keep requiring v1
  - Testing canary with v2

## [0.1.1] - 2021-09-30

### Fixed

- Using flag values from config when not reaching server.

## [0.1.0] - 2021-05-10

### Added

- Service
- Test-helpers
- Template helpers
