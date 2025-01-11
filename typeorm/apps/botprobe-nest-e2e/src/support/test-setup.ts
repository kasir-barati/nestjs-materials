/* eslint-disable */

import axios from 'axios';
import { axiosErrorInterceptor } from 'testing';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '4000';

  axios.defaults.baseURL = `http://${host}:${port}`;
  axios.interceptors.response.use(
    (response) => response,
    axiosErrorInterceptor,
  );
};
