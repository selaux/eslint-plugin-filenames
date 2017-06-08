var regexRule = require("../../lib/rules/match-regex"),
    RuleTester = require("eslint").RuleTester;

var exportingCode = 'module.exports = foo',
    testCode = "var foo = 'bar';",
    ruleTester = new RuleTester();

ruleTester.run("lib/rules/match-regex", regexRule, {
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
            options: [ "^[a-z_]+$" ]
        },
        {
            code: testCode,
            filename: "/foo/dir/foo_bar.js",
            options: [ "^[a-z_]+$" ]
        },
        {
            code: testCode,
            filename: "/foo/dir/fooBar.js"
        },
        {
            code: exportingCode,
            filename: "foo_bar.js",
            options: [ null, true ]
        },
        {
            code: exportingCode,
            filename: "fooBar.js",
            options: [ "^[a-z_]$", true ]
        },
        {
            code: testCode,
            filename: "valid.js",
            options: [ "^valid\.js$", undefined, true ]
        }
    ],

    invalid: [
        {
            code: testCode,
            filename: "/some/dir/foo_bar.js",
            errors: [
                { message: "Filename 'foo_bar.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/fooBAR.js",
            errors: [
                { message: "Filename 'fooBAR.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "fooBar$.js",
            errors: [
                { message: "Filename 'fooBar$.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "fooBar.js",
            options: [ "^[a-z_]$" ],
            errors: [
                { message: "Filename 'fooBar.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "in.valid.js",
            options: [ "^(?!in)\.valid\.js$", undefined, true ],
            errors: [
                { message: "Filename 'in.valid.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        }
    ]
});
