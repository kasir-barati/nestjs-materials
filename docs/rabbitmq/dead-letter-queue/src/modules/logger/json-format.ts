import type { Format } from 'logform';

import { format } from 'winston';

/**
 * Custom Winston format that outputs logs in JSON format.
 * This format includes all metadata and structures the log as JSON.
 */
export const jsonFormat: Format = format.combine(
  format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
  format.errors({ stack: true }),
  format.json(),
);
