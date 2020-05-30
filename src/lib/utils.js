const { existsSync } = require('fs');
const { parse } = require('path');
const { randomBytes } = require('crypto');

/**
 * Date object to (Y-m-d H:i:s) format string
 * @param {?Date} time
 * @return {string}
 */
export function formattedDateString(time) {
  let date = time;
  if (!(time instanceof Date)) {
    date = new Date();
  }

  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * @param {string} text
 */
export function cleanString(text) {
  if (text === null || typeof text === 'undefined') {
    return '';
  }
  return text.replace(/[^a-z0-9@.]+/gi, '-').toLowerCase();
}

/**
 *
 * @param {string} filename
 * @param {string} baseDirectory
 */
export function uniqueFilename(filename, baseDirectory) {
  const cleanedFilename = cleanString(filename.replace(/^\./g, ''));

  if (existsSync(`${baseDirectory}/${cleanedFilename}`) === false) {
    return cleanedFilename;
  }

  const info = parse(cleanedFilename);
  let counter = 1;
  let newFilename;

  for (;;) {
    newFilename = `${info.name}.${counter}${info.ext}`;
    if (existsSync(`${baseDirectory}/${newFilename}`) === false) {
      break;
    }
    counter += 1;
  }
  return newFilename;
}

/**
 * this should produce an exact same format as
 * what NSProcessInfo globallyUniqueIdentifier produces.
 */
export function globallyUniqueIdentifier() {
  const data = randomBytes(16);
  let hexData = Buffer.from(data.toString('binary'), 'ascii').toString('hex');

  hexData = hexData.match(/.{1,4}/g);

  let result = '%1%2-%3-%4-%5-%6%7%8';

  for (let i = 1; i < 9; i += 1) {
    result = result.replace(`%${i}`, hexData[i - 1]);
  }

  return result.toUpperCase();
}
