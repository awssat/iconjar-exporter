import { copyFileSync, mkdirSync, writeFileSync } from 'fs';
import { gzipSync } from 'zlib';
import IconJarSet from './iconjar-set';
import IconJarGroup from './iconjar-group';
import IconJarLicense from './iconjar-license';
import IconJarIcon from './iconjar-icon';
import CopyFileException from './exceptions/copy-file-exception';
import CreationException from './exceptions/creation-exception';
import { formattedDateString, uniqueFilename } from './utils';

class IconJar {
  static get EXT() {
    return 'iconjar';
  }

  static get VERSION() {
    return '2.0';
  }

  static get GZ_COMPRESSION_LEVEL() {
    return 1;
  }

  /**
   * IconJar constructor.
   *
   * @param {string} name
   * @param {IconJarSet[]|IconJarGroup[]} children
   */
  constructor(name, children) {
    this.name = name;
    if (typeof children !== 'undefined' && Array.isArray(children)) {
      this.children = children;
    } else {
      this.children = [];
    }
    this.groups = {};
    this.sets = {};
    this.icons = {};
    this.licenses = {};
    this.saveLocation = null;
  }

  /**
   * @param {IconJarSet} set
   *
   * @return {this}
   */
  addSet(set) {
    if (!(set instanceof IconJarSet)) {
      throw new TypeError(`'addSet' method can only receive a parameter of type 'IconJarSet'`);
    }
    this.children.push(set);
    return this;
  }

  /**
   * Add new set and from the callback you can add icons
   * @param {string} name
   * @param {function(IconJarSet):void} callback
   * @return {this}
   */
  addNewSet(name, callback) {
    const set = new IconJarSet(name);
    if (typeof callback === 'function') {
      callback(set);
    }
    this.addSet(set);
    return this;
  }

  /**
   * @param {IconJarGroup} group
   *
   * @return {this}
   */
  addGroup(group) {
    if (!(group instanceof IconJarGroup)) {
      throw new TypeError(`'addGroup' method can only receive a parameter of type 'IconJarGroup'`);
    }
    this.children.push(group);
    return this;
  }

  /**
   * Add new group and from the callback you can add sets/groups
   * @param {string} name
   * @param {function(IconJarGroup):void} callback
   * @return {this}
   */
  addNewGroup(name, callback) {
    const group = new IconJarGroup(name);
    if (typeof callback === 'function') {
      callback(group);
    }
    this.addGroup(group);
    return this;
  }

  /**
   * @private
   * @param {Array} children
   */
  compileArray(children) {
    if (!Array.isArray(children)) {
      throw new TypeError(`'compileArray' method can only receive a parameter of type 'Array'`);
    }
    children.forEach(child => {
      if (child instanceof IconJarSet) {
        this.compileSet(child);
      } else if (child instanceof IconJarGroup) {
        this.compileGroup(child);
      }
    });
  }

  /**
   * @private
   * @param {IconJarSet} set
   */
  compileSet(set) {
    if (!(set instanceof IconJarSet)) {
      throw new TypeError(`'compileSet' method can only receive a parameter of type 'IconJarSet'`);
    }
    const dict = {
      name: set.name,
      identifier: set.identifier,
      sort: set.sort,
      description: set.description || '', // cannot be null,
      date: formattedDateString(set.date),
    };

    if (set.group instanceof IconJarGroup) {
      dict.parent = set.group.identifier;
    }
    if (set.license instanceof IconJarLicense) {
      dict.license = this.compileLicense(set.license);
    }
    this.sets[set.identifier] = dict;

    set.icons.forEach(icon => {
      this.compileIcon(icon);
    });
  }

  /**
   * @private
   * @param {IconJarIcon} icon
   *
   * @return {string}
   * @throws {CopyFileException}
   */
  compileIcon(icon) {
    if (!(icon instanceof IconJarIcon)) {
      throw new TypeError(
        `'compileIcon' method can only receive a parameter of type 'IconJarIcon'`,
      );
    }

    icon.validate();

    const saveLocation = `${this.saveLocation}/icons`;
    const filename = uniqueFilename(icon.file, saveLocation);

    const dict = {
      name: icon.name,
      width: icon.width,
      height: icon.height,
      type: icon.type,
      file: filename,
      date: formattedDateString(icon.date),
      tags: icon.tagsString() || '', // cannot be null,
      identifier: icon.identifier,
      parent: icon.set.identifier,
      unicode: icon.unicode || '', // cannot be null
      description: icon.description || '', // cannot be null
    };

    if (icon.license instanceof IconJarLicense) {
      dict.licence = this.compileLicense(icon.license);
    }
    this.icons[icon.identifier] = dict;
    try {
      copyFileSync(icon.filePath, `${saveLocation}/${filename}`);
    } catch (error) {
      throw new CopyFileException(error.message);
    }

    return icon.identifier;
  }

  /**
   * @private
   * @param {IconJarLicense} license
   *
   * @return {?string}
   */
  compileLicense(license) {
    if (!(license instanceof IconJarLicense)) {
      throw new TypeError(
        `'compileLicense' method can only receive a parameter of type 'IconJarLicense'`,
      );
    }
    if (typeof this.licenses[license.identifier] !== 'undefined') {
      this.licenses[license.identifier] = {
        name: license.name,
        identifier: license.identifier,
        url: license.url,
        text: license.description || '', // cannot be null
      };
    }
    return license.identifier;
  }

  /**
   * @private
   * @param {IconJarGroup} group
   *
   * @return {?string}
   */
  compileGroup(group) {
    if (!(group instanceof IconJarGroup)) {
      throw new TypeError(
        `'compileGroup' method can only receive a parameter of type 'IconJarGroup'`,
      );
    }
    const dict = {
      name: group.name,
      identifier: group.identifier,
      sort: group.sort,
      description: group.description || '',
    };
    if (group.group instanceof IconJarGroup) {
      dict.parent = group.group.identifier;
    }
    this.groups[group.identifier] = dict;
    this.compileArray(group.getChildren());
    return group.identifier;
  }

  /**
   * @param {string} pathToSave
   * @param {boolean} overwrite
   *
   * @return {string}
   * @throws {CreationException}
   */
  save(pathToSave, overwrite = false) {
    const saveDirectory = `${pathToSave}/${this.name}.${IconJar.EXT}`;
    this.saveLocation = saveDirectory;
    try {
      mkdirSync(saveDirectory, {
        recursive: true,
      });
    } catch (error) {
      if (error && error.code !== 'EEXIST' && !overwrite) {
        throw new CreationException(error.message);
      }
    }

    const iconDirectory = `${saveDirectory}/icons`;

    try {
      mkdirSync(iconDirectory, {
        recursive: true,
      });
    } catch (error) {
      if (error && error.code !== 'EEXIST' && !overwrite) {
        throw new CreationException(error.message);
      }
    }

    this.compileArray(this.children);
    const dict = {
      meta: {
        version: IconJar.VERSION,
        date: formattedDateString(),
      },
      groups: this.groups,
      sets: this.sets,
      licences: this.licenses,
      items: this.icons,
    };

    const json = JSON.stringify(dict);

    const jsonData = gzipSync(json, { level: IconJar.GZ_COMPRESSION_LEVEL });

    const metaFile = `${saveDirectory}/META`;
    try {
      writeFileSync(metaFile, jsonData, {
        flag: typeof overwrite !== 'undefined' && overwrite ? 'w+' : 'wx+',
      });
    } catch (error) {
      throw new CreationException(error.message);
    }
    return saveDirectory;
  }
}

export default IconJar;
