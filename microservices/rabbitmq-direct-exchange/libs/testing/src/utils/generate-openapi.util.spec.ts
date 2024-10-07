import { OpenAPIObject } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { writeOpenApi } from './generate-openapi.util';

describe('writeOpenApi', () => {
  it('should write openApi.json', async () => {
    const openApi = {
      info: { title: 'test' },
    } as OpenAPIObject;
    const outputPath = writeOpenApi(openApi, '/tmp');

    const openApiJson = JSON.parse(
      await readFile(outputPath, {
        encoding: 'utf-8',
      }),
    );

    expect(openApiJson).toStrictEqual(openApi);
  });
});
