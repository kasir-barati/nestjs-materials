import { config } from 'dotenv';
import * as matchers from 'jest-extended';
import { join } from 'path';

config({
  path: [join(process.cwd(), '.env')],
});

expect.extend(matchers);
