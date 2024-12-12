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

    // Not gonna work because we can have at max 65535 "query parameters".
    // https://www.postgresql.org/docs/current/limits.html
    // await this.getRepository().insert(alerts)

    /**
     * Solution #1:
     * INSERT INTO table_name (field_name1, field_name2, field_name3)
     * VALUES (UNNEST(ARRAY[1, 2, 3]),
     *         UNNEST(ARRAY[100, 200, 300]),
     *         UNNEST(ARRAY['a', 'b', 'c'])
     * );
     */

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
         NOW(),
         NOW();
      `,
      [titles, descriptions, alertTypeIds],
    );
  }
}
