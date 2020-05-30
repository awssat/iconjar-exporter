import { globallyUniqueIdentifier } from './utils';

class IconJarLicense {
  /**
   * License constructor.
   *
   * @param {string} name
   * @param {?object} properties (url, description)
   */
  constructor(name, properties) {
    this.name = name || 'Untitled License';
    this.identifier = globallyUniqueIdentifier();
    const values = typeof properties === 'object' ? properties : {};
    this.url = values.url || null;
    this.description = values.description || null;
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
}

export default IconJarLicense;
