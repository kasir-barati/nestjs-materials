import { Seeder } from 'shared';
import { Alert } from '../alert/entities/alert.entity';
import { alertTypesIds } from './alert-type.seed';

const titles = new Array(1_000_000)
  .fill('')
  .map((_, index) => 'Alert title ' + (index + 1));
const descriptions = new Array(1_000_000)
  .fill('')
  .map((_, index) => 'Alert description ' + (index + 1));
let alertTypesIdsIndex = 0;
const alertTypeIds = new Array(1_000_000).fill('').map(() => {
  if (alertTypesIdsIndex === alertTypesIds.length) {
    alertTypesIdsIndex = 0;
  }

  return alertTypesIds[alertTypesIdsIndex++];
});

export class AlertSeeder extends Seeder<Alert> {
  async seed(): Promise<void> {
    if ((await this.getRepository().count()) > 0) {
      console.log('Alert has been seeded already!');
      return Promise.resolve();
    }

    // Not gonna work because we can have at max 65535 "query parameters". Learn more here: https://github.com/kasir-barati/sql/tree/main/docs/insert/
    // await this.getRepository().insert(alerts)

    // NOTE: here all the records will end up having same creation and update date due to how I wrote this SQL query.
    await this.getRepository().query(
      `INSERT INTO alert(id, title, description, "userId", "alertTypeId", "createdAt", "updatedAt")
       SELECT
         UNNEST(ARRAY(
           SELECT GEN_RANDOM_UUID() 
           FROM generate_series(1, 1000000)
         )),
         UNNEST($1::TEXT[]),
         UNNEST($2::TEXT[]),
         UNNEST(ARRAY(
           SELECT GEN_RANDOM_UUID() 
           FROM generate_series(1, 1000000)
         )),
         UNNEST($3::UUID[]),
         UNNEST(ARRAY(
           SELECT TIMESTAMP '2020-01-01' + (random() * (TIMESTAMP '2024-12-31' - TIMESTAMP '2020-01-01')) 
           FROM generate_series(1, 1000000)
         )),
         NOW();
      `,
      [titles, descriptions, alertTypeIds],
    );
  }
}
