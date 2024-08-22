import { generateRandomString } from './generate-random-string.util';

describe('generateRandomString', () => {
  it.each<number>([7, 13, 29])(
    'should generate random string %s character length',
    (length) => {
      const generatedRandomString = generateRandomString(length);

      expect(generatedRandomString.length).toBe(length);
    },
  );
});
