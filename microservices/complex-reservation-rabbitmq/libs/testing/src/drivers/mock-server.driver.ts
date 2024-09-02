import { Expectation, RequestDefinition } from 'mockserver-client';
import {
  mockServerClient,
  MockServerClient,
} from 'mockserver-client/mockServerClient';

export class MockserverDriver {
  private host: string = 'localhost';
  private port: number = 1081;
  private mockServerClient: MockServerClient;

  constructor(configs?: { port: number; host: string }) {
    if (configs) {
      this.port = configs.port;
      this.host = configs.host;
    }
    this.mockServerClient = mockServerClient(this.host, this.port);
  }

  /**
   *
   * @param expectation Matches requests using one or more of the request properties (e.g. req.body, or req.headers, or req.path)
   * @example
   * ```ts
   * mockserverDriver.mockResponse({
   *   httpRequest: {
   *     method: 'POST',
   *     path: '/v1/payment_intents',
   *   },
   * });
   * ```
   * Will matches requests sent to this path with the provided method.
   */
  async mockResponse(expectation: Expectation) {
    await this.mockServerClient.mockAnyResponse(expectation);
  }
  async verifyRequestWasNotReceived(request: RequestDefinition) {
    try {
      await this.mockServerClient.verify(request, 0);
      return true;
    } catch (error) {
      if (error.status === 406) {
        return false;
      }
    }
  }
  async verifyRequestWasReceived(request: RequestDefinition) {
    try {
      await this.mockServerClient.verify(request, 1);
      return true;
    } catch (error) {
      if (error.status === 406) {
        return false;
      }
    }
  }
  public async cleanup() {
    await this.mockServerClient.reset();
  }
}
