var mocha = require("mocha"),
    expect = require("chai").expect,
    index = require("../index.js"),
    matchRegex = require("../lib/rules/match-regex"),
    matchExported = require("../lib/rules/match-exported"),
    noIndex = require("../lib/rules/no-index");

mocha.describe("index.js", function () {
    "use strict";

    mocha.it("should export the match-regex rule", function () {
        expect(index.rules['match-regex']).to.equal(matchRegex);
    });

    mocha.it("should export the match-regex rule", function () {
        expect(index.rules['match-exported']).to.equal(matchExported);
    });

    mocha.it("should export the match-regex rule", function () {
        expect(index.rules['no-index']).to.equal(noIndex);
    });
});
