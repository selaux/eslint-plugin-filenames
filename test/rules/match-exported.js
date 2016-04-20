var exportedRule = require("../../lib/rules/match-exported"),
    RuleTester = require("eslint").RuleTester;

var testCode = "var foo = 'bar';",
    testCallCode = "export default foo();",
    exportedVariableCode = "module.exports = exported;",
    exportedClassCode = "module.exports = class Foo {};",
    exportedFunctionCode = "module.exports = function foo() {};",
    exportedEs6VariableCode = "export default exported;",
    exportedEs6ClassCode = "export default class Foo {};",
    exportedEs6FunctionCode = "export default function foo() {};",
    exportedEs6Index = "export default function index() {};",
    ruleTester = new RuleTester();

ruleTester.run("lib/rules/match-exported", exportedRule, {
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
            filename: "/some/dir/exported.js"
        },
        {
            code: testCallCode,
            filename: "/some/dir/exported.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedVariableCode,
            filename: "/some/dir/exported.js"
        },
        {
            code: exportedClassCode,
            filename: "/some/dir/Foo.js",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: exportedFunctionCode,
            filename: "/some/dir/foo.js"
        },
        {
            code: exportedEs6VariableCode,
            filename: "/some/dir/exported.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6ClassCode,
            filename: "/some/dir/Foo.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6FunctionCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6FunctionCode,
            filename: "/some/dir/foo/index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6FunctionCode,
            // /foo is used as cwd for test setup so full path will be /foo/index.js
            filename: "index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6Index,
            // /foo is used as cwd for test setup so full path will be /foo/index.js
            filename: "index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        }
    ],

    invalid: [
        {
            code: exportedVariableCode,
            filename: "/some/dir/fooBar.js",
            errors: [
                { message: "Filename 'fooBar' must match the exported name 'exported'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedClassCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "Filename 'foo' must match the exported name 'Foo'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedFunctionCode,
            filename: "/some/dir/bar.js",
            errors: [
                { message: "Filename 'bar' must match the exported name 'foo'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedEs6VariableCode,
            filename: "/some/dir/fooBar.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { message: "Filename 'fooBar' must match the exported name 'exported'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedEs6ClassCode,
            filename: "/some/dir/bar.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { message: "Filename 'bar' must match the exported name 'Foo'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedEs6FunctionCode,
            filename: "/some/dir/fooBar/index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { message: "The directory 'fooBar' must be named 'foo', after the exported value of its index file.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedVariableCode,
            filename: "index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [
                { message: "The directory 'foo' must be named 'exported', after the exported value of its index file.", column: 1, line: 1 }
            ]
        }
    ]

});