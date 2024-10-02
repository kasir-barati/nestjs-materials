import { config } from 'dotenv';
import * as matchers from 'jest-extended';
import { join } from 'path';

expect.extend(matchers);

config({
  path: [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'auth', '.env'),
  ],
});
