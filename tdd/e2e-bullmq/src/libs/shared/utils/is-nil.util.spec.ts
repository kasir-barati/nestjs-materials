import { isNil } from './is-nil.util';

describe('isNil', () => {
  it.each([null, undefined])('should return true for %p', (value) => {
    expect(isNil(value)).toBe(true);
  });

  it.each([123, 12.3, 'asdad', '', '  ', true, false, [], {}])(
    'should return false for a %p',
    (value) => {
      expect(isNil(value)).toBe(false);
    }
  );
});
