import { axiosErrorHandler } from '@app/testing';
import axios from 'axios';
import { config } from 'dotenv';
import * as matchers from 'jest-extended';
import { join } from 'path';

expect.extend(matchers);

config({
  path: [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'audit-log', '.env'),
  ],
});

axios.interceptors.response.use(
  (response) => response,
  axiosErrorHandler,
);
