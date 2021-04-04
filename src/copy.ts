import fs from 'fs';
import path from 'path';
import glob from 'globby';
import { log } from './log';


function copyInternal(files: string[], destFolder: string) {
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder);
    files.forEach((filename) => {
        log('Copy files', path.join(destFolder, path.basename(filename)));
        const streamOut = fs.createWriteStream(path.join(destFolder, path.basename(filename)));
        fs.createReadStream(filename).pipe(streamOut);
    });
}

export function copy(pattern: string, destFolder: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const files = await glob(pattern)
            copyInternal(files, destFolder);
            resolve(null)
        } catch (err) {
            reject(err)
        }
    })
}

export function copySync(pattern: string, destFolder: string) {
    copyInternal(glob.sync(pattern), destFolder);
}