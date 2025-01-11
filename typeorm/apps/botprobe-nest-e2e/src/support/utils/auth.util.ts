import axios from 'axios';
import { LoginResponse } from '../types/auth.type';

export class Auth {
  /**@returns Headers necessary for sending request to protected APIs */
  static async login() {
    const query = `#graphql
      query {
        login {
          accessToken
        }
      }
    `;
    const {
      data: {
        data: {
          login: { accessToken },
        },
      },
    } = await axios.post<LoginResponse>(`/graphql`, {
      query,
    });

    return {
      Authorization: 'Bearer ' + accessToken,
    };
  }
}
