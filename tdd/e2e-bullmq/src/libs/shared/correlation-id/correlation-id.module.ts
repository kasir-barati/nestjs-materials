import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { CorrelationIdInterceptor } from './correlation-id.interceptor';
import { CorrelationIdService } from './correlation-id.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        // automatically mount the ClsMiddleware for all routes
        mount: true,
      },
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CorrelationIdInterceptor },
    CorrelationIdService,
  ],
  exports: [CorrelationIdService],
})
export class CorrelationIdModule {}
