const fs = require('fs');

/**
 * @description Sleep the program for x ms
 * @param {number} timeMs 
 * @returns 
 */
async function sleep(timeMs) {
    return new Promise(x => setTimeout(x, timeMs));
};

/**
 * 
 * @param {string} path 
 * @param {Object} data 
 * @param {string} delimiter 
 */
function writeCsvRow(path, data, delimiter = ";") {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, Object.keys(data).join(delimiter) + '\n');
    }
    fs.appendFileSync(path, Object.values(data).join(delimiter) + '\n');
}

/**
 * 
 * @param {()} func 
 * @param {()} catchFunc 
 * @returns 
 */
async function tryCatch(func) {
    try {
        return [await func(), undefined];
    } catch (e) {
        return [null, e];
    }
};

module.exports = { sleep, writeCsvRow, tryCatch };