import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    constructor(private readonly clsService: ClsService) {}
    use(_: Request, res: Response, next: NextFunction) {
        const requestId = this.clsService.getId();
        res.setHeader('X-Request-Id', requestId);
        next();
    }
}
