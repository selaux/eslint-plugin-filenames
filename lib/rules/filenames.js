/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var path = require("path");

    var defaultRegexp = /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g,
        conventionRegexp = context.options[0] ? new RegExp(context.options[0]) : defaultRegexp;

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function matchesConvention(filenameWithoutExtension) {
        return conventionRegexp.test(filenameWithoutExtension);
    }

    function report(node, filename) {
        context.report(node, "Filename '{{name}}' does not match the naming convention.", { name: filename });
    }

    return {
        "Program": function(node) {
            var filename = context.getFilename(),
                extension = path.extname(filename),
                filenameWithoutExtension = path.basename(filename, extension);

            if (!matchesConvention(filenameWithoutExtension)) {
                report(node, filename);
            }
        }
    };

};
