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
    transforms = {
        kebab: require('lodash.kebabcase'),
        snake: require('lodash.snakecase'),
        camel: require('lodash.camelcase')
    };

function getStringToCheckAgainstExport(parsed) {
    var dirArray = parsed.dir.split(path.sep);
    var lastDirectory = dirArray[dirArray.length - 1];

    if (isIndexFile(parsed)) {
        return lastDirectory;
    } else {
        return parsed.name;
    }
}

function transform(exportedName, transformName) {
    var transform = transforms[transformName];

    return transform ? transform(exportedName) : exportedName;
}

module.exports = function(context) {
    return {
        "Program": function (node) {
            var transformName = context.options[0],
                filename = context.getFilename(),
                absoluteFilename = path.resolve(filename),
                parsed = parseFilename(absoluteFilename),
                shouldIgnore = isIgnoredFilename(filename),
                exportedName = getExportedName(node),
                isExporting = Boolean(exportedName),
                expectedExport = getStringToCheckAgainstExport(parsed),
                transformed = transform(exportedName, transformName),
                everythingIsIndex = exportedName === 'index' && parsed.name === 'index',
                matchesExported = transformed === expectedExport || everythingIsIndex,
                reportIf = function (condition, messageForNormalFile, messageForIndexFile) {
                    var message = (!messageForIndexFile || !isIndexFile(parsed)) ? messageForNormalFile : messageForIndexFile;

                    if (condition) {
                        context.report(node, message, {
                            name: parsed.base,
                            expectedExport: expectedExport,
                            exportName: transformed,
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

module.exports.schema = [
    {
        "enum": ["kebab", "snake", "camel"]
    }
];
