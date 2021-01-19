import { readFileSync } from 'fs';

// This will just override our require for *.json files and use
// JSON to parse.
require.extensions['.json'] = function(module, filename) {
    const content = readFileSync(filename, 'utf8');
    try {
        module.exports = JSON.parse(content);
    } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};
