import { getTempUser, login } from '@app/common';
import { Types } from 'mongoose';
import { ReservationServiceApi } from '../../api-client';

export class ReservationBuilder {
  private id: string;
  private end: string;
  private start: string;
  private amount: number;
  private token: string;
  private locationId: string;
  private reservationServiceApi: ReservationServiceApi;

  constructor() {
    this.id = new Types.ObjectId().toString();
    this.end = new Date().toISOString();
    this.start = new Date().toISOString();
    this.amount = 1231231;
    this.token = 'pm_card_discover';
    this.locationId = '66bf07a03c3dd10425e4fb94';
    this.reservationServiceApi = new ReservationServiceApi();
  }

  setId(value: string) {
    this.id = value;
    return this;
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
      await this.reservationServiceApi.reservationControllerCreateOrUpdate(
        {
          id: this.id,
          createOrUpdateReservationDto: {
            end: this.end,
            token: this.token,
            start: this.start,
            amount: this.amount,
            locationId: this.locationId,
          },
        },
        {
          headers: {
            'Cookie': authenticationJwtCookie,
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );

    return data._id;
  }
}
