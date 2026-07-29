import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { AxiosError, isAxiosError } from 'axios'

const logger = new Logger('MapAxiosToHttpException')

interface UpstreamErrorBody {
  message?: string | string[]
  error?: string
}

/**
 * @description Rethrows an error thrown by `axios` / `@nestjs/axios` as an appropriate NestJS HttpException.
 *
 * @example
 * ```ts
 * const response = await firstValueFrom(
 *   this.httpService.get(url, config)
 * ).catch(mapAxiosErrorToHttpError)
 * ```
 */
export function mapAxiosErrorToHttpError(error: unknown): never {
  if (!isAxiosError(error)) {
    throw error
  }

  const axiosError = error as AxiosError<UpstreamErrorBody>
  const status = axiosError.response?.status
  const message = extractMessage(axiosError)

  switch (status) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(message)
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(message)
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(message)
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(message)
    case HttpStatus.CONFLICT:
      throw new ConflictException(message)
    default:
      logger.error(`Unexpected error from upstream service (status ${status ?? 'unknown'}): ${axiosError.message}`)
      throw new InternalServerErrorException()
  }
}

function extractMessage(error: AxiosError<UpstreamErrorBody>): string | undefined {
  const body = error.response?.data

  if (!body) {
    return undefined
  }

  if (Array.isArray(body.message)) {
    return body.message.join(', ')
  }

  return body.message
}
