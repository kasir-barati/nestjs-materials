import axios from 'axios';
import { config } from 'dotenv';
import { join } from 'path';
import { axiosErrorHandler } from './utils/axios-error-handler.util';

config({
  path: [join(process.cwd(), '.env')],
});

axios.interceptors.response.use((response) => response, axiosErrorHandler);
