import type { AxiosError } from 'axios';

export function axiosErrorInterceptor(error: AxiosError) {
  const request = {
    method: error.request?.method,
    path: error.request?.path,
    headers: error?.request?.headers,
  };
  const response = {
    statusCode: error.response?.status,
    config: {
      url: error.response?.config?.url,
      method: error.response?.config?.method,
      data: error.response?.config?.data,
      headers: error.response?.config?.headers,
    },
    data: error.response?.data,
  };
  const errorData = {
    code: error.code,
    config: {
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.config?.data,
      headers: error?.config?.headers,
    },
  };

  console.dir({ errorData }, { depth: null });
  console.dir({ request }, { depth: null });
  console.dir({ response }, { depth: null });

  return Promise.reject(error);
}
