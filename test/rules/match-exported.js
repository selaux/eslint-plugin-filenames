var exportedRule = require("../../lib/rules/match-exported"),
    RuleTester = require("eslint").RuleTester;

var testCode = "var foo = 'bar';",
    testCallCode = "export default foo();",
    exportedVariableCode = "module.exports = exported;",
    exportedJsxClassCode = "module.exports = class Foo { render() { return <span>Test Class</span>; } };",
    exportedClassCode = "module.exports = class Foo {};",
    exportedFunctionCode = "module.exports = function foo() {};",
    exportedJsxFunctionCode = "module.exports = function foo() { return <span>Test Fn</span> };",
    exportedEs6VariableCode = "export default exported;",
    exportedEs6ClassCode = "export default class Foo {};",
    exportedEs6JsxClassCode = "export default class Foo { render() { return <span>Test Class</span>; } };",
    exportedEs6FunctionCode = "export default function foo() {};",
    exportedEs6JsxFunctionCode = "export default function foo() { return <span>Test Fn</span> };",
    exportedEs6Index = "export default function index() {};",
    camelCaseCommonJS = "module.exports = variableName;",
    snakeCaseCommonJS = "module.exports = variable_name;",
    camelCaseEs6 = "export default variableName;",
    snakeCaseEs6 = "export default variable_name;",
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
            code: exportedJsxClassCode,
            filename: "/some/dir/Foo.js",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }
        },
        {
            code: exportedFunctionCode,
            filename: "/some/dir/foo.js"
        },
        {
            code: exportedJsxFunctionCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaFeatures: { jsx: true } }
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
            code: exportedEs6JsxClassCode,
            filename: "/some/dir/Foo.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } }
        },
        {
            code: exportedEs6FunctionCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6JsxFunctionCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } }
        },
        {
            code: exportedEs6FunctionCode,
            filename: "/some/dir/foo/index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: exportedEs6JsxFunctionCode,
            filename: "/some/dir/foo/index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } }
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
            code: exportedJsxClassCode,
            filename: "/some/dir/foo.js",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
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
            code: exportedJsxFunctionCode,
            filename: "/some/dir/bar.js",
            parserOptions: { ecmaFeatures: { jsx: true } },
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
            code: exportedEs6JsxClassCode,
            filename: "/some/dir/bar.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } },
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
            code: exportedEs6JsxFunctionCode,
            filename: "/some/dir/fooBar/index.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } },
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
        },
        {
            code: exportedJsxClassCode,
            filename: "/some/dir/Foo.react.js",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            errors: [
                { message: "Filename 'Foo.react' must match the exported name 'Foo'.", column: 1, line: 1 }
            ]
        }
    ]
});

ruleTester.run("lib/rules/match-exported with configuration", exportedRule, {
    valid: [
        {
            code: camelCaseCommonJS,
            filename: "variable_name.js",
            options: ['snake']
        },
        {
            code: camelCaseCommonJS,
            filename: "variable_name/index.js",
            options: ['snake']
        },
        {
            code: camelCaseCommonJS,
            filename: "variable-name.js",
            options: ['kebab']
        },
        {
            code: snakeCaseCommonJS,
            filename: "variableName.js",
            options: ['camel']
        },
        {
            code: camelCaseEs6,
            filename: "variable_name.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: ['snake']
        },
        {
            code: camelCaseEs6,
            filename: "variable-name.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: ['kebab']
        },
        {
            code: snakeCaseEs6,
            filename: "variableName.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: ['camel']
        },
        {
            code: exportedJsxClassCode,
            filename: "/some/dir/Foo.react.js",
            parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } },
            options: ["", "\\.react"]
        },
        {
            code: exportedEs6JsxClassCode,
            filename: "/some/dir/Foo.react.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } },
            options: ["", "\\.react"]
        }
    ],

    invalid: [
        {
            code: camelCaseCommonJS,
            filename: "variableName.js",
            options: ['snake'],
            errors: [
                { message: "Filename 'variableName' must match the exported name 'variable_name'.", column: 1, line: 1 }
            ]
        },
        {
            code: camelCaseEs6,
            filename: "variableName.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: ['kebab'],
            errors: [
                { message: "Filename 'variableName' must match the exported name 'variable-name'.", column: 1, line: 1 }
            ]
        },
        {
            code: exportedEs6JsxClassCode,
            filename: "/some/dir/Foo.bar.js",
            parserOptions: { ecmaVersion: 6, sourceType: "module", ecmaFeatures: { jsx: true } },
            options: ["", "\\.react"],
            errors: [
                { message: "Filename 'Foo.bar' must match the exported name 'Foo'.", column: 1, line: 1 }
            ]
        }
    ]
});
