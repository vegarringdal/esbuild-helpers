import { readFileSync } from 'fs';

// This will just override our require for *.json files and use
// JSON to parse.
require.extensions['.json'] = function(module, filename) {
    const content = readFileSync(filename, 'utf8');
    try {
        // regex from https://stackoverflow.com/questions/40685262/read-json-file-ignoring-custom-comments  (thank you :-))
        module.exports = JSON.parse(content.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m));
    } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};
