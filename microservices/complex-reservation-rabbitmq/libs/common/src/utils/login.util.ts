import axios from 'axios';

/**
 * @returns {string} authentication JWT cookie
 */
export async function login(email: string, password: string) {
  const { headers } = await axios.post(
    `http://localhost:${process.env.AUTH_SERVICE_PORT}/auth/login`,
    {
      email,
      password,
    },
  );

  return headers['set-cookie'].find((cookie) =>
    cookie.includes('Authentication'),
  );
}
