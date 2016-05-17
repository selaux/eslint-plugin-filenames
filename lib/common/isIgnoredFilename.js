var ignoredFilenames = [ "<text>", "<input>" ];

module.exports = function isIndexFile(filename) {
    return ignoredFilenames.indexOf(filename) !== -1;
};
