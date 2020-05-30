import { globallyUniqueIdentifier } from './utils';
import IconJarSet from './iconjar-set';

class IconJarGroup {
  /**
   * Group constructor.
   *
   * @param {string}        name
   * @param {IconJarSet[]|IconJarGroup[]} children
   */
  constructor(name, children) {
    this.name = name || 'Untitled';
    if (typeof children !== 'undefined' && Array.isArray(children)) {
      this.children = children;
    } else {
      this.children = [];
    }
    this.identifier = globallyUniqueIdentifier();
    this.description = null;
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
   * @param {IconJarSet} set
   *
   * @return {this}
   */
  addSet(set) {
    if (!(set instanceof IconJarSet)) {
      throw new TypeError(`'addSet' method can only receive a parameter of type 'IconJarSet`);
    }
    this.children.push(set);
    this.children[this.children.length - 1].group = this;
    return this;
  }

  /**
   * Add new set and from the callback you can add icons to it
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
   * Add new subgroup and from the callback you can add sets to it
   * @param {string} name
   * @param {function(IconJarGroup):void} callback
   * @return {this}
   */
  addNewSubGroup(name, callback) {
    const group = new IconJarGroup(name);
    if (typeof callback === 'function') {
      callback(group);
    }
    this.addSubGroup(group);
    return this;
  }

  /**
   * @param {IconJarGroup} group
   *
   * @return {this}
   */
  addSubGroup(group) {
    if (!(group instanceof IconJarGroup)) {
      throw new TypeError(`'addGroup' method can only receive a parameter of type 'IconJarGroup`);
    }
    this.children.push(group);
    this.children[this.children.length - 1].group = this;
    return this;
  }

  /**
   * @return {Array|IconJarGroup[]|IconJarSet[]}
   */
  getChildren() {
    return this.children;
  }
}

export default IconJarGroup;
