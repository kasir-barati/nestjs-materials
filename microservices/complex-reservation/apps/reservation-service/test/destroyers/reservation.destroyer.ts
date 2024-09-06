import { getTempUser, login } from '@app/common';
import { ReservationServiceApi } from '../../api-client';

export class ReservationDestroyer {
  private reservationServiceApi: ReservationServiceApi;

  constructor(private id: string) {
    this.reservationServiceApi = new ReservationServiceApi();
  }

  async destroy(): Promise<void> {
    const user = getTempUser();
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );

    await this.reservationServiceApi.reservationControllerDelete(
      {
        id: this.id,
      },
      {
        headers: {
          Cookie: authenticationJwtCookie,
        },
      },
    );
  }
}
