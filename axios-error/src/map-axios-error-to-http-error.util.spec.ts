import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { AxiosError, AxiosHeaders } from 'axios'

import { mapAxiosErrorToHttpError } from './map-axios-error-to-http-error.util'

function buildAxiosError(status: number | undefined, body?: unknown): AxiosError {
  const error = new AxiosError('Request failed with status code ' + status)

  if (status !== undefined) {
    error.response = {
      status,
      statusText: '',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: body,
    } as any
  }

  return error
}

describe(mapAxiosErrorToHttpError.name, () => {
  it.each([
    [400, BadRequestException],
    [401, UnauthorizedException],
    [403, ForbiddenException],
    [404, NotFoundException],
    [409, ConflictException],
  ])('should throw the matching HttpException when the upstream returned %i', (status, ExceptionClass) => {
    const axiosError = buildAxiosError(status, { message: 'upstream said no' })

    expect(() => mapAxiosErrorToHttpError(axiosError)).toThrow(ExceptionClass)
    expect(() => mapAxiosErrorToHttpError(axiosError)).toThrow('upstream said no')
  })

  it('should join an array of messages when the upstream returns validation errors', () => {
    const axiosError = buildAxiosError(400, { message: ['name too long', 'query is empty'] })

    expect(() => mapAxiosErrorToHttpError(axiosError)).toThrow('name too long, query is empty')
  })

  it('should throw InternalServerErrorException for unmapped statuses (e.g. 500)', () => {
    const axiosError = buildAxiosError(500, { message: 'boom' })

    expect(() => mapAxiosErrorToHttpError(axiosError)).toThrow(InternalServerErrorException)
  })

  it('should throw InternalServerErrorException when the AxiosError has no response (network error)', () => {
    const axiosError = buildAxiosError(undefined)

    expect(() => mapAxiosErrorToHttpError(axiosError)).toThrow(InternalServerErrorException)
  })

  it('should rethrow non-Axios errors unchanged', () => {
    const original = new Error('a genuine bug')

    expect(() => mapAxiosErrorToHttpError(original)).toThrow(original)
  })
})
