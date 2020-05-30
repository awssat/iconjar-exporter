const {
  formattedDateString,
  cleanString,
  uniqueFilename,
  globallyUniqueIdentifier,
} = require('../src/lib/utils');

test('formattedDateString test', () => {
  const date = new Date('12-10-2010 12:13:11 PM');
  expect(formattedDateString(date)).toBe('2010-12-10 12:13:11');
  expect(formattedDateString()).toMatch(new RegExp(`^${new Date().getFullYear()}-`));
});

test('cleanString test', () => {
  expect(cleanString('Hello? SALAM90!')).toBe('hello-salam90-');
  expect(cleanString(null)).toBe('');
});

test('uniqueFilename test', () => {
  expect(uniqueFilename('love.svg', __dirname)).toBe('love.svg');
  expect(uniqueFilename('utils.test.js', __dirname)).toBe('utils.test.1.js');
});

test('globallyUniqueIdentifier test', () => {
  expect(globallyUniqueIdentifier()).toHaveLength(36);
});
