var mocha = require("mocha"),
    expect = require("chai").expect,
    index = require("../index.js"),
    rule = require("../lib/rules/filenames");

mocha.describe("index.js", function () {
    "use strict";

    mocha.it("should export the filenames rule", function () {
        expect(index.rules.filenames).to.equal(rule);
    });
});
