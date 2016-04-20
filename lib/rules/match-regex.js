/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

"use strict";

var path = require("path"),
    parseFilename = require('../common/parseFilename'),
    isIgnoredFilename = require('../common/isIgnoredFilename');

module.exports = function(context) {
    var defaultRegexp = /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g,
        conventionRegexp = context.options[0] ? new RegExp(context.options[0]) : defaultRegexp;

    return {
        "Program": function(node) {
            var filename = context.getFilename(),
                absoluteFilename = path.resolve(filename),
                parsed = parseFilename(absoluteFilename),
                shouldIgnore = isIgnoredFilename(filename),
                matchesRegex = conventionRegexp.test(parsed.name);

            if (shouldIgnore) return;
            if (!matchesRegex) {
                context.report(node, "Filename '{{name}}' does not match the naming convention.", {
                    name: parsed.base
                });
            }
        }
    };

};
