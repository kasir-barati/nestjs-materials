import { ReservationServiceApi } from '../../api-client';

export class ReservationBuilder {
  private end: string;
  private start: string;
  private invoiceId: string;
  private locationId: string;
  private reservationServiceApi: ReservationServiceApi;

  constructor() {
    this.end = new Date().toISOString();
    this.start = new Date().toISOString();
    this.invoiceId = '66bf079a665dc2b271bc1432';
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
  setInvoiceId(value: string) {
    this.invoiceId = value;
    return this;
  }
  setLocationId(value: string) {
    this.locationId = value;
    return this;
  }
  async build(): Promise<string> {
    const { data } =
      await this.reservationServiceApi.reservationControllerCreate({
        createReservationDto: {
          end: this.end,
          start: this.start,
          invoiceId: this.invoiceId,
          locationId: this.locationId,
        },
      });

    return data._id;
  }
}
