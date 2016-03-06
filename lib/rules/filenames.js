/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

"use strict";

var path = require("path");
var ignoredFilenames = [ "<text>", "<input>" ];

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

function parseFilename(filename) {
    var ext = path.extname(filename);
    var dir = path.dirname(filename);

    return {
        dir: dir === '.' ? '' : dir,
        base: path.basename(filename),
        ext: ext,
        name: path.basename(filename, ext)
    }
}

function isIndexFile(parsed) {
    return parsed.name === 'index';
}

function getStringToCheckAgainstExport(parsed) {
    var dirArray = parsed.dir.split(path.sep);
    var lastDirectory = dirArray[dirArray.length - 1];

    if (isIndexFile(parsed)) {
      return lastDirectory || parsed.name;
    } else {
      return parsed.name;
    }
}

module.exports = function(context) {
    var defaultRegexp = /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g,
        conventionRegexp = context.options[0] ? new RegExp(context.options[0]) : defaultRegexp,
        flag = context.options[1] || "match-regex",
        allowIndexFiles = typeof context.options[2] !== 'undefined' ? context.options[2] : true;

    return {
        "Program": function(node) {
            var filename = context.getFilename(),
                parsed = parseFilename(filename),
                isFromStdin = ignoredFilenames.indexOf(filename) !== -1,
                exportedName = getExportedName(node);


            if (isFromStdin) return;

            var matchesRegex = conventionRegexp.test(parsed.name);
            var isExporting = Boolean(exportedName);
            var expectedExport = getStringToCheckAgainstExport(parsed);
            var matchesExported = expectedExport === exportedName;

            var reportIf = function (condition, messageForNormalFile, messageForIndexFile) {
                var message = (!messageForIndexFile || !isIndexFile(parsed)) ? messageForNormalFile : messageForIndexFile;

                if (condition) {
                    context.report(node, message, {
                        name: parsed.base,
                        expectedExport: expectedExport,
                        exportName: exportedName,
                        extension: parsed.ext,
                        flag: flag
                    });
                }
            };

            if (!allowIndexFiles) {
                reportIf(
                    isIndexFile(parsed),
                    "'index.js' files are not allowed."
                );
            }
            else if (flag === "match-regex" || !isExporting) {
                reportIf(
                    !matchesRegex,
                    "Filename '{{name}}' does not match the naming convention."
                );
            }
            else if (flag === "match-regex-or-exported") {
                reportIf(
                    !matchesRegex && !matchesExported,
                    "Filename '{{name}}' does not match the naming convention nor exported value '{{exportName}}'.",
                    "Filename '{{name}}' does not match the naming convention nor does its parent directory '{{expectedExport}}' match its exported value '{{exportName}}'."
                );
            }
            else if (flag === "match-exported-or-regex") {
                reportIf(
                    !matchesExported,
                    "File '{{name}}' must be named '{{exportName}}{{extension}}', after its exported value.",
                    "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file."
                );
            }
            else { // Match both, flag === "match-exported-and-regex" || flag === "match-regex-and-exported"
                reportIf(!matchesRegex, "Filename '{{name}}' does not match the naming convention.");
                reportIf(
                    !matchesExported,
                    "File '{{name}}' must be named '{{exportName}}{{extension}}', after its exported value.",
                    "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file."
                );
            }
        }
    };

};
