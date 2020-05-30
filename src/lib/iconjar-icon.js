import { basename, extname } from 'path';
import { globallyUniqueIdentifier } from './utils';
import InvalidTypeException from './exceptions/invalid-type-exception';
import DimensionsException from './exceptions/dimensions-exception';
import IconJarLicense from './iconjar-license';

class IconJarIcon {
  static get TYPE_UNKNOWN() {
    return -1;
  }

  static get TYPE_SVG() {
    return 0;
  }

  static get TYPE_PNG() {
    return 1;
  }

  static get TYPE_GIF() {
    return 2;
  }

  static get TYPE_PDF() {
    return 3;
  }

  static get TYPE_ICNS() {
    return 4;
  }

  static get TYPE_WEBP() {
    return 5;
  }

  static get TYPE_ICO() {
    return 6;
  }

  /**
   * Icon constructor.
   *
   * @param {string} name
   * @param {string} fileOnDisk
   * @param {?object}    properties
   */
  constructor(name, fileOnDisk, properties) {
    this.name = name || 'Untitled Icon';
    this.filePath = fileOnDisk;
    this.file = basename(this.filePath);
    this.identifier = globallyUniqueIdentifier();
    const values = typeof properties === 'object' ? properties : {};
    this.type = values.type || IconJarIcon.iconType(fileOnDisk);

    this.description = values.description || null;
    this.tags = values.tags || [];
    this.width = values.width || 0;
    this.height = values.height || 0;
    this.date = values.date || null;
    this.unicode = values.unicode || null;
    this.set = values.set || null;
  }

  /**
   * @param {string} name
   * @param {*} value
   * @return {this}
   */
  setProperty(name, value) {
    this[name] = value;
    return this;
  }

  /**
   * @param {int} width
   * @param {int} height
   * @return {this}
   */
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }

  /**
   * Add new license and from the callback you can set properties to it
   * @param {string} name
   * @param {function(IconJarLicense):void} callback
   * @return {this}
   */
  addNewLicense(name, callback) {
    const license = new IconJarLicense(name);
    if (typeof callback === 'function') {
      callback(license);
    }
    this.addLicense(license);
    return this;
  }

  /**
   * @param {IconJarLicense} license
   * @return {this}
   */
  addLicense(license) {
    if (!(license instanceof IconJarLicense)) {
      throw new TypeError(
        `'addLicense' method can only receive a parameter of type 'IconJarLicense`,
      );
    }
    this.license = license;
    return this;
  }

  /**
   * @param {string} file
   *
   * @return {int}
   */
  static iconType(file) {
    const extension = extname(file || '').replace(/^\./, '');

    const extensions = {
      svg: IconJarIcon.TYPE_SVG,
      png: IconJarIcon.TYPE_PNG,
      gif: IconJarIcon.TYPE_GIF,
      pdf: IconJarIcon.TYPE_PDF,
      icns: IconJarIcon.TYPE_ICNS,
      webp: IconJarIcon.TYPE_WEBP,
      icon: IconJarIcon.TYPE_ICO,
    };
    if (Object.keys(extensions).includes(extension.toLowerCase())) {
      return extensions[extension];
    }
    return IconJarIcon.TYPE_UNKNOWN;
  }

  /**
   * @param {string} tag
   *
   * @return {this}
   */
  addTag(tag) {
    this.tags.push(tag);
    return this;
  }

  /**
   * @param {string[]} tags
   *
   * @return {this}
   */
  addTags(tags) {
    if (!Array.isArray(tags)) {
      throw new TypeError(`'addTags' method can only receive a parameter of type 'Array`);
    }
    this.tags.concat(tags);
    return this;
  }

  /**
   * @return {string}
   */
  tagsString() {
    return this.tags
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .join(',');
  }

  /**
   * @throws {DimensionsException}
   * @throws {InvalidTypeException}
   */
  validate() {
    if (this.type === IconJarIcon.TYPE_UNKNOWN) {
      throw new InvalidTypeException();
    }
    if (this.type !== IconJarIcon.TYPE_SVG) {
      if (this.width === 0 || this.height === 0) {
        throw new DimensionsException();
      }
    }
  }
}

export default IconJarIcon;
