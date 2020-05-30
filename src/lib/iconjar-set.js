import IconJarIcon from './iconjar-icon';
import IconJarLicense from './iconjar-license';

const { globallyUniqueIdentifier } = require('./utils');

class IconJarSet {
  /**
   * Set constructor.
   *
   * @param {string} name
   * @param {iconJarIcon[]} icons
   */
  constructor(name, icons) {
    this.name = name || 'Untitled Set';
    this.icons = icons || [];
    this.identifier = globallyUniqueIdentifier();
    this.description = null;
    this.license = null;
    this.date = null;
    this.group = null;
    this.sort = 0;
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
   * @param {IconJarIcon} icon
   *
   * @return {this}
   */
  addIcon(icon) {
    if (!(icon instanceof IconJarIcon)) {
      throw new TypeError(`'addIcon' method can only receive a parameter of type 'IconJarIcon`);
    }

    this.icons.push(icon);
    this.icons[this.icons.length - 1].set = this;

    return this;
  }

  /**
   * Add new icon and from the callback you can set properties to it
   * @param {string} name
   * @param {string} fileOnDisk
   * @param {function(IconJarIcon):void} callback
   * @return {this}
   */
  addNewIcon(name, fileOnDisk, callback) {
    const icon = new IconJarIcon(name, fileOnDisk);
    if (typeof callback === 'function') {
      callback(icon);
    }
    this.addIcon(icon);
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
}

export default IconJarSet;
