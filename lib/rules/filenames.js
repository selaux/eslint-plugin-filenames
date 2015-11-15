/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var path = require("path");
var ignoredFilenames = [ "<text>", "<input>" ];

module.exports = function(context) {

    "use strict";

    var defaultRegexp = /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g,
        conventionRegexp = context.options[0] ? new RegExp(context.options[0]) : defaultRegexp,
        flag = context.options[1] || "match-regex";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function getNodeName(node) {
        if (node.type === "Identifier") {
            return node.name;
        }

        if (node.id && node.id.type === "Identifier") {
            return node.id.name;
        }
    }

    function getExportedName(programNode) {
        for (var i = 0; i < programNode.body.length; i += 1) {
            var node = programNode.body[i];

            // export default ...
            if (node.type === "ExportDefaultDeclaration") {
                return getNodeName(node.declaration);
            }

            // module.exports = ...
            if (node.type === "ExpressionStatement" &&
                node.expression.type === "AssignmentExpression" &&
                node.expression.left.type === "MemberExpression" &&
                node.expression.left.object.type === "Identifier" &&
                node.expression.left.object.name === "module" &&
                node.expression.left.property.type === "Identifier" &&
                node.expression.left.property.name === "exports"
            ) {
                return getNodeName(node.expression.right);
            }
        }
    }

    return {
        "Program": function(node) {
            var filename = context.getFilename(),
                extension = path.extname(filename),
                isFromStdin = ignoredFilenames.indexOf(filename) !== -1,
                filenameWithoutExtension = path.basename(filename, extension),
                exportedName = getExportedName(node);

            if (isFromStdin) return;

            var matchesRegex = conventionRegexp.test(filenameWithoutExtension);

            var isExporting = Boolean(exportedName);
            var matchesExported = filenameWithoutExtension === exportedName;

            var reportIf = function (condition, message) {
                if (condition) {
                    context.report(node, message, {
                        name: filename,
                        exportName: exportedName,
                        extension: extension,
                        flag: flag
                    });
                }
            };

            if (flag === "match-regex" || !isExporting) {
                reportIf(!matchesRegex, "Filename '{{name}}' does not match the naming convention.");
            }
            else if (flag === "match-regex-or-exported") {
                reportIf(!matchesRegex && !matchesExported, "Filename '{{name}}' does not match the naming convention nor exported value '{{exportName}}'.");
            }
            else if (flag === "match-exported-or-regex") {
                reportIf(!matchesExported, "File '{{name}}' must be named '{{exportName}}{{extension}}', after its exported value.");
            }
            else { // Match both, flag === "match-exported-and-regex" || flag === "match-regex-and-exported"
                reportIf(!matchesRegex, "Filename '{{name}}' does not match the naming convention.");
                reportIf(!matchesExported, "File '{{name}}' must be named '{{exportName}}{{extension}}', after its exported value.");
            }
        }
    };

};
