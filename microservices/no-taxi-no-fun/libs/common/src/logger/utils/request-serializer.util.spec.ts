import { SinonMock } from '@app/testing';
import { Request } from 'express';
import { serializeRequest } from './request-serializer.util';

describe('serializeRequest', () => {
  it('should serialize request', () => {
    const serializedRequest = serializeRequest(
      SinonMock.with<Request & Record<string, any>>({
        id: 'a46b57bb-07f4-469e-bca4-b8f6979525aa',
        url: '/path/123',
        body: { f1: 12345, f2: 'Something' },
        query: { f1: 'asd' },
        params: { '0': '123' },
        method: 'PATCH',
        headers: {
          'host': 'localhost:3000',
          'connection': 'keep-alive',
          'content-length': '38',
          'accept': 'application/json',
          'user-agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'content-type': 'application/json',
          'origin': 'http://localhost:3000',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language':
            'en-US,en;q=0.9,de;q=0.8,ja;q=0.7,fa;q=0.6',
          'cookie': 'fusionauth.locale=en;',
        },
        remotePort: 49134,
        remoteAddress: '::1',
        secure: false,
      }),
    );

    expect(serializedRequest).toStrictEqual({
      id: 'a46b57bb-07f4-469e-bca4-b8f6979525aa',
      url: '/path/123',
      body: { f1: 12345, f2: 'Something' },
      query: { f1: 'asd' },
      params: { '0': '123' },
      method: 'PATCH',
      headers: {
        'host': 'localhost:3000',
        'connection': 'keep-alive',
        'content-length': '38',
        'accept': 'application/json',
        'user-agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'content-type': 'application/json',
        'origin': 'http://localhost:3000',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language':
          'en-US,en;q=0.9,de;q=0.8,ja;q=0.7,fa;q=0.6',
        'cookie': 'fusionauth.locale=en;',
      },
      remotePort: 49134,
      remoteAddress: '::1',
    });
  });
});
