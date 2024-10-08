import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Log, LogSchema } from '../entities/log.entity';
import { LogRepository } from './log.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema,
      },
    ]),
  ],
  providers: [LogRepository],
  exports: [LogRepository],
})
export class LogRepositoryModule {}
