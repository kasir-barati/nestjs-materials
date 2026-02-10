import type { Format } from 'logform';

import { format } from 'winston';

/**
 * Custom Winston format that extracts correlationId from metadata
 * and prepends it to the log message in a readable format.
 */
export const correlationIdFormat: Format = format((info) => {
  if (info.correlationId) {
    info.message = `(correlationId: ${info.correlationId}) ${info.message}`;
    delete info.correlationId;
  }
  return info;
})();
