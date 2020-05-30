import IconJar from './lib/iconjar';

/**
 * Exported module
 * @type {IconJar}
 */
function iconJarExporter(name, children) {
  return new IconJar(name, children);
}

export default iconJarExporter;
