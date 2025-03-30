import type { ValidationError } from 'class-validator';

import { randomUUID } from 'crypto';

import { extractConstraints } from './extract-constraints.util';

describe('extractConstraints', () => {
  it('should return an array of constraints from deeply nested objects', () => {
    const data: ValidationError[] = [
      {
        property: '',
        target: {
          id: randomUUID(),
          user: {
            age: 20,
            address: {
              country: 'Random Country',
              town: 'some-value',
            },
            name: 'something',
            property: 'town',
            children: [
              {
                target: {
                  country: 'Random Country',
                  town: 'some-value',
                },
                value: 'some-value',
                property: 'town',
                children: [],
                constraints: {
                  isEnum:
                    'town must be one of the following values: BEIJING, HONG KONG, SHANGHAI, TOKYO',
                },
              },
            ],
          },
        },
      },
    ];

    const result = extractConstraints(data);

    expect(result).toEqual([
      'town must be one of the following values: BEIJING, HONG KONG, SHANGHAI, TOKYO',
    ]);
  });

  it('should return an empty array if it gets an empty array', () => {
    const data: ValidationError[] = [];

    const result = extractConstraints(data);

    expect(result).toEqual([]);
  });

  it('should return all constraints from multiple nested objects', () => {
    const data: ValidationError[] = [
      {
        property: '',
        target: {
          id: randomUUID(),
          user: {
            children: [
              {
                target: {
                  age: 12.12,
                  name: true,
                },
                constraints: {
                  isInt: 'age must be an integer number',
                },
              },
              {
                target: {
                  postalCode: {},
                },
                constraints: {
                  isString: 'postalCode must be string',
                },
              },
            ],
          },
        },
      },
    ];

    const result = extractConstraints(data);

    expect(result).toEqual([
      'age must be an integer number',
      'postalCode must be string',
    ]);
  });
});
