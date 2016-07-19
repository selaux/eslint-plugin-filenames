# eslint-plugin-filenames

[![NPM Version](https://img.shields.io/npm/v/eslint-plugin-filenames.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-filenames)
[![Build Status](https://img.shields.io/travis/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://travis-ci.org/selaux/eslint-plugin-filenames)
[![Coverage Status](https://img.shields.io/coveralls/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://coveralls.io/r/selaux/eslint-plugin-filenames?branch=master)
[![Dependencies](https://img.shields.io/david/selaux/eslint-plugin-filenames.svg?style=flat-square)](https://david-dm.org/selaux/eslint-plugin-filenames)

Adds [eslint](http://eslint.org/) rules to ensure consistent filenames for your javascript files.

__Please note__: This plugin will only lint the filenames of the `.js`-files you are linting with eslint. It will ignore all other files (e.g. non-js files, files not linted with eslint).

## Enabling the plugin

This plugin requires a version of `eslint>=1.0.0` to be installed as a peer dependency.

Modify your `.eslintrc` file to load the plugin and enable the rules you want to use.

```json
{
  "plugins": [
    "filenames"
  ],
  "rules": {
    "filenames/match-regex": 2,
    "filenames/match-exported": 2,
    "filenames/no-index": 2
  }
}
```

## Rules

### Consistent Filenames via regex (match-regex)

A rule to enforce a certain file naming convention using a regular expression.

The convention can be configured using a regular expression (the default is `camelCase.js`). Additionally
exporting files can be ignored with a second configuration parameter.

```json
"filenames/match-regex": [2, "^[a-z_]+$", true]
```

With these configuration options, `camelCase.js` will be reported as an error while `snake_case.js` will pass.
Additionally the files that have a named default export (according to the logic in the `match-exported` rule) will be
ignored.  They could be linted with the `match-exported` rule.

### Matching Exported Values (match-exported)

Match the file name against the default exported value in the module. Files that dont have a default export will
be ignored. The exports of `index.js` are matched against their parent directory.

```js
// Considered problem only if the file isn't named foo.js or foo/index.js
export default function foo() {}

// Considered problem only if the file isn't named Foo.js or Foo/index.js
module.exports = class Foo() {}

// Considered problem only if the file isn't named someVariable.js or someVariable/index.js
module.exports = someVariable;

// Never considered a problem
export default { foo: "bar" };
```

If your filename policy doesn't quite match with your variable naming policy, you can add a tansform:

```json
"filenames/match-exported": [2, "kebab"]
```

Now, in your code:

```js
// Considered problem only if file isn't named variable-name.js or variable-name/index.js
export default function variableName;
```

Available transforms:
'[snake](https://www.npmjs.com/package/lodash.snakecase)',
'[kebab](https://www.npmjs.com/package/lodash.kebabcase)', and
'[camel](https://www.npmjs.com/package/lodash.camelcase)'

### Don't allow index.js files (no-index)

Having a bunch of `index.js` files can have negative influence on developer experience, e.g. when
opening files by name. When enabling this rule. `index.js` files will always be considered a problem.

## Changelog

#### 1.1.0
- Introduce `transform` option for `match-exported`

#### 1.0.0
- Split rule into `match-regex`, `match-exported` and `no-index`

#### 0.2.0
- Add match-exported flags

#### 0.1.2
- Fix example in README

#### 0.1.1
- Fix: Text via stdin always passes
- Tests: Travis builds also run on node 0.12 and iojs now

#### 0.1.0
- Initial Release
