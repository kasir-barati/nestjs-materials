import { axiosErrorHandler } from '@app/testing';
import axios from 'axios';
import { config } from 'dotenv';
import { join } from 'path';

config({
  path: [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'driver-api', '.env'),
  ],
});

axios.interceptors.response.use(
  (response) => response,
  axiosErrorHandler,
);