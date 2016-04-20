/**
 * @fileoverview Rule to ensure that filenames match the exports of the file
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var path = require('path'),
    parseFilename = require('../common/parseFilename'),
    isIgnoredFilename = require('../common/isIgnoredFilename'),
    isIndexFile = require('../common/isIndexFile');

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

function getStringToCheckAgainstExport(parsed) {
    var dirArray = parsed.dir.split(path.sep);
    var lastDirectory = dirArray[dirArray.length - 1];

    if (isIndexFile(parsed)) {
        return lastDirectory;
    } else {
        return parsed.name;
    }
}

module.exports = function(context) {
    return {
        "Program": function (node) {
            var filename = context.getFilename(),
                absoluteFilename = path.resolve(filename),
                parsed = parseFilename(absoluteFilename),
                shouldIgnore = isIgnoredFilename(filename),
                exportedName = getExportedName(node),
                isExporting = Boolean(exportedName),
                expectedExport = getStringToCheckAgainstExport(parsed),
                everythingIsIndex = exportedName === 'index' && parsed.name === 'index',
                matchesExported = expectedExport === exportedName || everythingIsIndex,
                reportIf = function (condition, messageForNormalFile, messageForIndexFile) {
                    var message = (!messageForIndexFile || !isIndexFile(parsed)) ? messageForNormalFile : messageForIndexFile;

                    if (condition) {
                        context.report(node, message, {
                            name: parsed.base,
                            expectedExport: expectedExport,
                            exportName: exportedName,
                            extension: parsed.ext
                        });
                    }
                };

            if (shouldIgnore) return;
            reportIf(
                isExporting && !matchesExported,
                "Filename '{{expectedExport}}' must match the exported name '{{exportName}}'.",
                "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file."
            );
        }
    }
};