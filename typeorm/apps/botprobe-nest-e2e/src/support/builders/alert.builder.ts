import axios from 'axios';
import { AlertBuilderResponse } from '../types/alert.type';
import { Auth } from '../utils/auth.util';

export class AlertBuilder {
  private title: string;
  private alertTypeId: string;
  private description: string;

  constructor() {
    this.title = 'Some title ' + Date.now();
    this.alertTypeId = '8f55cefb-402d-4615-9025-548f76362c27';
    this.description = 'Some random desc ' + Date.now();
  }

  setTitle(title: string) {
    this.title = title;

    return this;
  }

  setAlertTypeId(alertTypeId: string) {
    this.alertTypeId = alertTypeId;

    return this;
  }

  setDescription(description: string) {
    this.description = description;

    return this;
  }

  async build() {
    const query = `#graphql
      mutation CreateOneAlert($input: CreateOneAlertInput!) {
        createOneAlert(input: $input) {
          id
        }
      }
    `;
    const authHeaders = await Auth.login();
    const {
      data: {
        data: {
          createOneAlert: { id },
        },
      },
    } = await axios.post<AlertBuilderResponse>(
      '/graphql',
      {
        query,
        variables: {
          input: {
            alert: {
              title: this.title,
              alertTypeId: this.alertTypeId,
              description: this.description,
            },
          },
        },
      },
      { headers: authHeaders },
    );

    return id;
  }
}
