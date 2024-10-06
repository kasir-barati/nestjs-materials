import { IsStrongPasswordOptions } from 'class-validator';

export const strongPasswordConf: IsStrongPasswordOptions = {
  minLength: 8,
  minNumbers: 1,
  minLowercase: 1,
  // You have to do this step since default values are 1
  // https://github.com/validatorjs/validator.js/blob/master/src/lib/isStrongPassword.js
  minSymbols: 0,
  minUppercase: 0,
};
