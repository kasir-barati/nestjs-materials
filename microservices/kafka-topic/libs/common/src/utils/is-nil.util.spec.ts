import { isNil } from './is-nil.util';

describe('isNil', () => {
  it.each([null, undefined])('should return true', (value) => {
    const result = isNil(value);

    expect(result).toBeTrue();
  });

  it.each([1, 2.34, 'a', '', true, {}])(
    'should return false',
    (value) => {
      const result = isNil(value);

      expect(result).toBeFalse();
    },
  );
});
