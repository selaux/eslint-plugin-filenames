# eslint-plugin-filenames

[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-filenames.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-filenames)
[![Build Status](https://img.shields.io/travis/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://travis-ci.org/selaux/eslint-plugin-filenames)
[![Coverage Status](https://img.shields.io/coveralls/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://coveralls.io/r/selaux/eslint-plugin-filenames?branch=master)
[![Dependencies](https://img.shields.io/david/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://david-dm.org/selaux/eslint-plugin-filenames)

Adds [eslint](http://eslint.org/) rules to ensure consistent filenames for your javascript files.

__Please note__: This plugin will only lint the filenames of the `.js`-files you are linting with eslint. It will ignore all other files (e.g. non-js files, files not linted with eslint).

## Enabling the plugin

This plugin requires a version of `eslint>=1.0.0` to be installed as a peer dependency.

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

```js
"filenames/filenames": [2, "^[a-z_]+$"]
```

An extra option can be set to check the file name against the default exported value in the module.
By default, the exported value is ignored.The exports of `index.js` are matched against their
parent directory.

#### `"match-regex-and-exported"` or `"match-exported-and-regex"`

The file name must match the regular expression and the exported value name, if any. Example:

```js
"filenames/filenames": [2, "^[a-z_]+$", "match-regex-and-exported"]
```

```js
// Considered problem only if the file isn't named foo.js
export default function foo() {}

// Always considered problem, since the exported value doesn't match the regular expression
// (conflicting options)
module.exports = class Foo {};

// Considered problem only if the file doesn't match the regular expression
export default { foo: "bar" };
```

#### `"match-exported-or-regex"`

The file name must match the exported value name, if any. Else it should match the regular
expression.

```js
"filenames/filenames": [2, "^[a-z_]+$", "match-exported-or-regex"]
```

```js
// Considered problem only if the file isn't named foo.js
export default foo {}

// Considered problem only if the file isn't named Foo.js
module.exports = class Foo {};

// Considered problem only if the file doesn't match the regular expression
export default { foo: "bar" };
```

#### `"match-regex-or-exported"`

The file name must match the regular expression. Else it should match the exported value name, if
any.

```js
"filenames/filenames": [2, "^[a-z_]+$", "match-regex-or-exported"]
```

```js
// Considered problem only if the file doesn't match the regular expression or isn't named foo.js
export default foo {}

// Considered problem only if the file doesn't match the regular expression or isn't named Foo.js
module.exports = class Foo {};

// Considered problem only if the file doesn't match the regular expression
export default { foo: "bar" };
```


## Changelog

#### 0.2.0
- Add match-exported flags

#### 0.1.2
- Fix example in README

#### 0.1.1
- Fix: Text via stdin always passes
- Tests: Travis builds also run on node 0.12 and iojs now

#### 0.1.0
- Initial Release
