import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
// 재사용을 위해 모듈화
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
