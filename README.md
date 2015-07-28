# eslint-plugin-filenames

[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-filenames.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-filenames)
[![Build Status](https://img.shields.io/travis/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://travis-ci.org/selaux/eslint-plugin-filenames)
[![Coverage Status](https://img.shields.io/coveralls/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://coveralls.io/r/selaux/eslint-plugin-filenames?branch=master)
[![Dependencies](https://img.shields.io/david/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://david-dm.org/selaux/eslint-plugin-filenames)

Adds [eslint](http://eslint.org/) rules to ensure consistent filenames for your javascript files.

__Please note__: This plugin will only lint the filenames of the `.js`-files you are linting with eslint. It will ignore all other files (e.g. non-js files, files not linted with eslint).

## Enabling the plugin

Modify your `.eslintrc` file to load the plugin and enable the rule.

```
{
  "plugins": [
    "filenames"
  ],
  "rules": {
    "filenames/filenames": 2
  }
}
```

## Rules

### Consistent Filenames (filenames)

A rule to enforce a certain file naming convention.

The convention can be configured using a regular expression (the default is `camelCase.js`):

```
"filenames/filenames": [2, "^[a-z_]+$"]
```

## Changelog

#### 0.1.2
- Fix example in README

#### 0.1.1
- Fix: Text via stdin always passes
- Tests: Travis builds also run on node 0.12 and iojs now

#### 0.1.0
- Initial Release
