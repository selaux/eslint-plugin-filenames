var sinon = require("sinon"),
    filenamesRule = require("../../lib/rules/filenames"),
    RuleTester = require("eslint").RuleTester;

var testCode = "var foo = 'bar';",
    testExportingCode = "module.exports = exported;",
    ruleTester = new RuleTester();

beforeEach(function () {
    sinon.stub(process, "cwd").returns('/foo');
});

afterEach(function () {
    process.cwd.restore();
});

ruleTester.run("lib/rules/filenames", filenamesRule, {
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
            filename: "/some/dir/exported.js",
            options: [ null, "match-regex-and-exported" ]
        },
        {
            code: testCode,
            filename: "/some/dir/exported.js",
            options: [ null, "match-regex-or-exported" ]
        },
        {
            code: testCode,
            filename: "/some/dir/exported.js",
            options: [ null, "match-exported-or-regex" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/exported.js",
            options: [ null, "match-regex-and-exported" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/bar.js",
            options: [ null, "match-regex-or-exported" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/exported.js",
            options: [ "^a$", "match-exported-or-regex" ]
        },
        {
            code: "module.exports = foo;",
            filename: "/some/dir/foo.js",
            options: [ "^", "match-exported-and-regex" ]
        },
        {
            code: "module.exports = class Foo {};",
            filename: "/some/dir/Foo.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module.exports = function foo() {}",
            filename: "/some/dir/foo.js",
            options: [ "^", "match-exported-and-regex" ]
        },
        {
            code: "export default foo;",
            filename: "/some/dir/foo.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default class Foo {}",
            filename: "/some/dir/Foo.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function foo() {}",
            filename: "/some/dir/foo.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function () {}",
            filename: "/some/dir/foo.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: testCode,
            filename: "/some/dir/exported/index.js",
            options: [ null, "match-regex-and-exported" ]
        },
        {
            code: testCode,
            filename: "/some/dir/exported/index.js",
            options: [ null, "match-regex-or-exported" ]
        },
        {
            code: testCode,
            filename: "/some/dir/exported/index.js",
            options: [ null, "match-exported-or-regex" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/exported/index.js",
            options: [ null, "match-regex-and-exported" ]
        },
        {
            code: "module.exports = index;",
            filename: "index.js",
            options: [ "^index", "match-regex-and-exported" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/bar/index.js",
            options: [ null, "match-regex-or-exported" ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/exported/index.js",
            options: [ "^a$", "match-exported-or-regex" ]
        },
        {
            code: "module.exports = foo;",
            filename: "/some/dir/foo/index.js",
            options: [ "^", "match-exported-and-regex" ]
        },
        {
            code: "module.exports = class Foo {};",
            filename: "/some/dir/Foo/index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "module.exports = function foo() {}",
            filename: "/some/dir/foo/index.js",
            options: [ "^", "match-exported-and-regex" ]
        },
        {
            code: "export default foo;",
            filename: "/some/dir/foo/index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default class Foo {}",
            filename: "/some/dir/Foo/index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function foo() {}",
            filename: "/some/dir/foo/index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function () {}",
            filename: "/some/dir/foo/index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: "export default function foo() {}",
            filename: "index.js",
            options: [ "^", "match-exported-and-regex" ],
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: testCode,
            filename: "/some/dir/index.js",
            options: [ "^[a-z]+$", "match-regex", true ],
            errors: [
                { message: "'index.js' files are not allowed.", column: 1, line: 1 }
            ]
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
            filename: "/some/dir/fooBar$.js",
            errors: [
                { message: "Filename 'fooBar$.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/fooBar.js",
            options: [ "^[a-z_]$" ],
            errors: [
                { message: "Filename 'fooBar.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/fooBar.js",
            options: [ null, "match-regex-and-exported" ],
            errors: [
                { message: "File 'fooBar.js' must be named 'exported.js', after its exported value.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo.js",
            options: [ "^[a-z_]$", "match-regex-and-exported" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention.", column: 1, line: 1 },
                { message: "File 'foo.js' must be named 'exported.js', after its exported value.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo.js",
            options: [ "^a$", "match-regex-or-exported" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention nor exported value 'exported'.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo.js",
            options: [ null, "match-exported-or-regex" ],
            errors: [
                { message: "File 'foo.js' must be named 'exported.js', after its exported value.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/foo.js",
            options: [ "^[a-z_]$", "match-exported-or-regex" ],
            errors: [
                { message: "Filename 'foo.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/fooBar/index.js",
            options: [ null, "match-regex-and-exported" ],
            errors: [
                { message: "The directory 'fooBar' must be named 'exported', after the exported value of its index file.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo/index.js",
            options: [ "^[a-z_]$", "match-regex-and-exported" ],
            errors: [
                { message: "Filename 'index.js' does not match the naming convention.", column: 1, line: 1 },
                { message: "The directory 'foo' must be named 'exported', after the exported value of its index file.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo/index.js",
            options: [ "^a$", "match-regex-or-exported" ],
            errors: [
                { message: "Filename 'index.js' does not match the naming convention nor does its parent directory 'foo' match its exported value 'exported'.", column: 1, line: 1 }
            ]
        },
        {
            code: testExportingCode,
            filename: "/some/dir/foo/index.js",
            options: [ null, "match-exported-or-regex" ],
            errors: [
                { message: "The directory 'foo' must be named 'exported', after the exported value of its index file.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/foo/index.js",
            options: [ "^[a-z_]$", "match-exported-or-regex" ],
            errors: [
                { message: "Filename 'index.js' does not match the naming convention.", column: 1, line: 1 }
            ]
        },
        {
            code: testCode,
            filename: "/some/dir/index.js",
            options: [ "^[a-z]+$", "match-regex", false ],
            errors: [
                { message: "'index.js' files are not allowed.", column: 1, line: 1 }
            ]
        }
    ]

});