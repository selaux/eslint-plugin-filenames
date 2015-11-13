var linter = require("eslint").linter,
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(linter),
    testCode = "var foo = 'bar';",
    testExportingCode = "module.exports = exported;";

eslintTester.addRuleTest("lib/rules/filenames", {

    valid: [
        {
            code: testCode,
            filename: "<text>"
        },
        {
            code: testCode,
            filename: "<input>"
        },
        {
            code: testCode,
            filename: "foobar.js"
        },
        {
            code: testCode,
            filename: "fooBar.js"
        },
        {
            code: testCode,
            filename: "foo1Bar1.js"
        },
        {
            code: testCode,
            filename: "foo_bar.js",
            args: [ 1, "^[a-z_]+$" ]
        },
        {
            code: testCode,
            filename: "exported.js",
            args: [ 1, null, "match-regex-and-exported" ]
        },
        {
            code: testCode,
            filename: "exported.js",
            args: [ 1, null, "match-regex-or-exported" ]
        },
        {
            code: testCode,
            filename: "exported.js",
            args: [ 1, null, "match-exported-or-regex" ]
        },
        {
            code: testExportingCode,
            filename: "exported.js",
            args: [ 1, null, "match-regex-and-exported" ]
        },
        {
            code: testExportingCode,
            filename: "bar.js",
            args: [ 1, null, "match-regex-or-exported" ]
        },
        {
            code: testExportingCode,
            filename: "exported.js",
            args: [ 1, "^a$", "match-exported-or-regex" ]
        },

        // Testing exported name extraction
        {
            code: "module.exports = foo;",
            filename: "foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true }
        },
        {
            code: "module.exports = class Foo {};",
            filename: "Foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true, classes: true }
        },
        {
            code: "module.exports = function foo() {}",
            filename: "foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true }
        },
        {
            code: "export default foo;",
            filename: "foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true }
        },
        {
            code: "export default class Foo {}",
            filename: "Foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true, classes: true }
        },
        {
            code: "export default function foo() {}",
            filename: "foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true }
        },
        {
            code: "export default function () {}", // No exported name
            filename: "foo.js",
            args: [ 1, "^", "match-exported-and-regex" ],
            ecmaFeatures: { modules: true }
        },
    ],

    invalid: [
        {
            code: testCode,
            filename: "foo_bar.js",
            errors: [
                { message: "Filename 'foo_bar.js' does not match the naming convention.", column: 0, line: 0 }
            ]
        },
        {
            code: testCode,
            filename: "fooBAR.js",
            errors: [
                { message: "Filename 'fooBAR.js' does not match the naming convention.", column: 0, line: 0 }
            ]
        },
        {
            code: testCode,
            filename: "fooBar$.js",
            errors: [
                { message: "Filename 'fooBar$.js' does not match the naming convention.", column: 0, line: 0 }
            ]
        },
        {
            code: testCode,
            filename: "fooBar.js",
            args: [ 1, "^[a-z_]$" ],
            errors: [
                { message: "Filename 'fooBar.js' does not match the naming convention.", column: 0, line: 0 }
            ]
        },
        {
            code: testExportingCode,
            filename: "fooBar.js",
            args: [ 1, null, "match-regex-and-exported" ],
            errors: [
                { message: "File 'fooBar.js' must be named 'exported.js'.", column: 0, line: 0 }
            ]
        },
        {
            code: testExportingCode,
            filename: "foo.js",
            args: [ 1, "^[a-z_]$", "match-regex-and-exported" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention.", column: 0, line: 0 },
                { message: "File 'foo.js' must be named 'exported.js'.", column: 0, line: 0 }
            ]
        },
        {
            code: testExportingCode,
            filename: "foo.js",
            args: [ 1, "^a$", "match-regex-or-exported" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention nor exported value 'exported'.", column: 0, line: 0 }
            ]
        },
        {
            code: testExportingCode,
            filename: "foo.js",
            args: [ 1, null, "match-exported-or-regex" ],
            errors: [
                { message: "File 'foo.js' must be named 'exported.js'.", column: 0, line: 0 }
            ]
        },
        {
            code: testCode,
            filename: "foo.js",
            args: [ 1, "^[a-z_]$", "match-exported-or-regex" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention.", column: 0, line: 0 }
            ]
        }
    ]

});
