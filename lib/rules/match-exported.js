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
    isIndexFile = require('../common/isIndexFile');

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
