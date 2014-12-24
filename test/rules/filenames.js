var linter = require("eslint").linter,
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(linter),
    testCode = "var foo = 'bar';";

eslintTester.addRuleTest("lib/rules/filenames", {

    valid: [
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
        }
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
                { message: "Filename \'fooBar.js\' does not match the naming convention.", column: 0, line: 0 }
            ]
        }
    ]

});
