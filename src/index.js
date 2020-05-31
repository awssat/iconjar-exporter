import IconJar from './lib/iconjar';

/**
 * Exported module
 * @return {IconJar}
 */
function iconJarExporter(name, children) {
  return new IconJar(name, children);
}

export default iconJarExporter;
