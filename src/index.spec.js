import IconJarExporter from '.';
import IconJar from './lib/iconjar';

/** @test {IconJarExporter} */
describe('IconJarExporter', () => {
  it('exists', () => {
    expect(IconJarExporter).toBeDefined();
  });

  it('returns instance of IconJar', () => {
    expect(IconJarExporter('name')).toBeInstanceOf(IconJar);
  });
  it('can be chainable', () => {
    expect(IconJarExporter('name').addNewGroup('x', () => {})).toBeInstanceOf(IconJar);
  });
});
