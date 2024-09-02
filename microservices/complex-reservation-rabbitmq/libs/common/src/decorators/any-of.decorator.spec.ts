import { plainToInstance } from 'class-transformer';
import { IsString, validate } from 'class-validator';
import { AnyOf } from './any-of.decorator';

@AnyOf(['email', 'phone'])
class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

describe('AnyOf', () => {
  it.each([{ email: 'email@em.cc' }, { phone: '0123456789' }])(
    'should pass when email or phone is provided',
    async (data) => {
      const user = plainToInstance(CreateUserDto, data);

      const errors = await validate(user);

      expect(errors).toHaveLength(0);
    },
  );

  it('should throw an error when nor email or phone is provided', async () => {
    const user = plainToInstance(CreateUserDto, {});

    const errors = await validate(user);

    expect(errors).toHaveLength(2);
    expect(errors).toEqual([
      {
        children: [],
        constraints: { isString: 'email must be a string' },
        property: 'email',
        target: {},
        value: undefined,
      },
      {
        children: [],
        constraints: { isString: 'phone must be a string' },
        property: 'phone',
        target: {},
        value: undefined,
      },
    ]);
  });
});
