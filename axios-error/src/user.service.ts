import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { mapAxiosErrorToHttpError } from "./map-axios-error-to-http-error.util";

/**
 * Deliberately NO manual error handling.
 */
@Injectable()
export class UserService {
  private readonly base =
    process.env.MOCK_UPSTREAM_URL ?? "http://wiremock:8080";

  constructor(private readonly http: HttpService) { }

  async fetchForbidden(): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.get(`${this.base}/forbidden`),
    );

    return response.data;
  }

  async fetchMappedForbidden(): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.get(`${this.base}/forbidden`),
    ).catch(mapAxiosErrorToHttpError);

    return response.data;
  }

  async fetchNotFound(): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.get(`${this.base}/not-found`),
    );

    return response.data;
  }

  async postBadRequest(): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.post(`${this.base}/bad-request`, {}),
    );

    return response.data;
  }

  async postConflict(): Promise<unknown> {
    const response = await firstValueFrom(
      this.http.post(`${this.base}/conflict`, {}),
    );

    return response.data;
  }
}
