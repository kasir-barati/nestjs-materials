import { containsNull } from './contains-null.util';

describe('containsNull', () => {
  it.each([
    [{ mp4: null }, 'mp4'],
    [{ mp3: { src: '', alt: null } }, 'mp3.alt'],
    [
      { unknown: [{ src: 'alien', destination: null }] },
      'unknown.0.destination',
    ],
    [
      { asia: [{ country: 'japan', gpd: { value: null } }] },
      'asia.0.gpd.value',
    ],
    [
      { moon: { worker: 'manager', group: [{ hide: null }] } },
      'moon.group.0.hide',
    ],
  ])('should return true + null field path', (obj, nullField) => {
    const { result, field } = containsNull(obj);

    expect(result).toBeTruthy();
    expect(field).toBe(nullField);
  });
});
