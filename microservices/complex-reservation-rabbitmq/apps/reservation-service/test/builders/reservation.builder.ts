import { login } from '@app/common';
import { getTempUser } from '@app/testing';
import { ReservationServiceApi } from '../../api-client';

export class ReservationBuilder {
  private end: string;
  private start: string;
  private amount: number;
  private token: string;
  private locationId: string;
  private reservationServiceApi: ReservationServiceApi;

  constructor() {
    this.end = new Date().toISOString();
    this.start = new Date().toISOString();
    this.amount = 1231231;
    this.token = 'pm_card_discover';
    this.locationId = '66bf07a03c3dd10425e4fb94';
    this.reservationServiceApi = new ReservationServiceApi();
  }

  setEnd(value: string | Date) {
    this.end =
      typeof value === 'string' ? value : value.toISOString();
    return this;
  }
  setStart(value: string | Date) {
    this.start =
      typeof value === 'string' ? value : value.toISOString();
    return this;
  }
  setAmount(value: number) {
    this.amount = value;
    return this;
  }
  setLocationId(value: string) {
    this.locationId = value;
    return this;
  }
  setToken(value: string) {
    this.token = value;
    return this;
  }
  async build(): Promise<string> {
    const user = getTempUser();
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const { data } =
      await this.reservationServiceApi.reservationControllerCreate(
        {
          createReservationDto: {
            end: this.end,
            token: this.token,
            start: this.start,
            amount: this.amount,
            locationId: this.locationId,
          },
        },
        {
          headers: {
            Cookie: authenticationJwtCookie,
          },
        },
      );

    return data._id;
  }
}
