import { OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * @description Write OpenApi as a json file and then exit this NodeJS process
 * @returns {string} The path to the generated OpenAPI json file
 */
export function writeOpenApi(
  document: OpenAPIObject,
  outputDirectory: string,
): string {
  const openApi = JSON.stringify(document);
  const outputPath = join(outputDirectory, 'openApi.json');

  writeFileSync(outputPath, openApi, 'utf-8');

  return outputPath;
}
