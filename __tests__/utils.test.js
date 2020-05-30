/* eslint-disable no-undef */
import {
  formattedDateString,
  cleanString,
  uniqueFilename,
  globallyUniqueIdentifier,
} from '../src/lib/utils';

/** @test {utils} */
describe('IconJar Utils', () => {
  it('formats Date to a string ', () => {
    const date = new Date('12-10-2010 12:13:11 PM');
    expect(formattedDateString(date)).toBe('2010-12-10 12:13:11');
    expect(formattedDateString()).toMatch(new RegExp(`^${new Date().getFullYear()}-`));
  });

  it('cleans string', () => {
    expect(cleanString('Hello? SALAM90!')).toBe('hello-salam90-');
    expect(cleanString(null)).toBe('');
  });

  it('makes unique filename', () => {
    expect(uniqueFilename('love.svg', __dirname)).toBe('love.svg');
    expect(uniqueFilename('utils.test.js', __dirname)).toBe('utils.test.1.js');
  });

  it('globallyUniqueIdentifier test', () => {
    expect(globallyUniqueIdentifier()).toHaveLength(36);
  });
});
