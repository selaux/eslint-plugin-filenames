var indexRule = require("../../lib/rules/no-index"),
    RuleTester = require("eslint").RuleTester;

var testCode = "var foo = 'bar';",
    ruleTester = new RuleTester();

ruleTester.run("lib/rules/no-index", indexRule, {
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
            filename: "foo.js"
        },
        {
            code: testCode,
            filename: "/some/dir/foo.js"
        }
    ],

    invalid: [
        {
            code: testCode,
            filename: "index.js",
            errors: [
                { message: "'index.js' files are not allowed.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/index.js",
            errors: [
                { message: "'index.js' files are not allowed.", column: 1, line: 1 }
            ]
        }
    ]
});
