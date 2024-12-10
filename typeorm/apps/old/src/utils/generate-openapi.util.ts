import { OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

/**
 * @description Write OpenApi as a json file and then exit this NodeJS process
 */
export function writeOpenApi(
  document: OpenAPIObject,
  outputDirectory: string,
) {
  const openApi = JSON.stringify(document);

  writeFileSync(`${outputDirectory}/openApi.json`, openApi, 'utf-8');
  process.exit(0);
}
