import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { ISinonMock, SinonMock } from 'testing';
import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
    let clsService: ISinonMock<ClsService>;
    let middleware: LoggingMiddleware;

    beforeEach(() => {
        clsService = SinonMock.of(ClsService);
        middleware = new LoggingMiddleware(clsService);
    });

    it.each(['requestId', 'anotherRequestId'])(
        'middleware.use should append request id as header attribute to response',
        async (requestId: string) => {
            const response = SinonMock.with<Response>({});
            clsService.getId.returns(requestId);

            middleware.use(
                SinonMock.with<Request>({}),
                response,
                () => {
                    /* */
                },
            );

            expect(response.setHeader.lastCall.args).toStrictEqual([
                'X-Request-Id',
                requestId,
            ]);
        },
    );
});
