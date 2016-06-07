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
    getExportedName = require('../common/getExportedName'),
    isIndexFile = require('../common/isIndexFile'),
    kebabCase = require('lodash.kebabcase'),
    snakeCase = require('lodash.snakecase'),
    camelCase = require('lodash.camelcase');

function getStringToCheckAgainstExport(parsed) {
    var dirArray = parsed.dir.split(path.sep);
    var lastDirectory = dirArray[dirArray.length - 1];

    if (isIndexFile(parsed)) {
        return lastDirectory;
    } else {
        return parsed.name;
    }
}

function transform(exportedName, context) {
    var options = context.options[0] || {},
        transform = options.transform;

    if (!transform) {
        return null;
    }

    switch (transform) {
    case 'kebab':
        return kebabCase(exportedName);
    case 'snake':
        return snakeCase(exportedName);
    case 'camel':
        return camelCase(exportedName);
    // no default case, because any other values are invalid based on the schema
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
                transformed = transform(exportedName, context),
                transformedText = transformed ? ' (transformed)' : '',
                everythingIsIndex = exportedName === 'index' && parsed.name === 'index',
                matchesExported = (transformed ? transformed === expectedExport : expectedExport === exportedName) || everythingIsIndex,
                reportIf = function (condition, messageForNormalFile, messageForIndexFile) {
                    var message = (!messageForIndexFile || !isIndexFile(parsed)) ? messageForNormalFile : messageForIndexFile;

                    if (condition) {
                        context.report(node, message, {
                            name: parsed.base,
                            expectedExport: expectedExport,
                            exportName: transformed || exportedName,
                            extension: parsed.ext
                        });
                    }
                };

            if (shouldIgnore) return;
            reportIf(
                isExporting && !matchesExported,
                "Filename '{{expectedExport}}' must match the" + transformedText + " exported name '{{exportName}}'.",
                "The directory '{{expectedExport}}' must be named '{{exportName}}', after the" + transformedText + " exported value of its index file."
            );
        }
    }
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "transform": {
                "enum": ["kebab", "snake", "camel"]
            }
        },
        "additionalProperties": false
    }
];
