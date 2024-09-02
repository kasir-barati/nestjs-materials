import {
  configureExceptionListeners,
  onRejectAxios,
} from '@app/testing';
import axios from 'axios';
import { config } from 'dotenv';
import { join } from 'path';

config({
  path: [
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'notification-service', '.env'),
  ],
});
configureExceptionListeners();

axios.interceptors.response.use(
  (response) => response,
  onRejectAxios,
);
