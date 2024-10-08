import { axiosErrorHandler } from '@app/testing';
import axios from 'axios';
import { config } from 'dotenv';
import * as matchers from 'jest-extended';
import { join } from 'path';

config({
  path: [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'verification-api', '.env'),
  ],
});

axios.interceptors.response.use(
  (response) => response,
  axiosErrorHandler,
);

expect.extend(matchers);
