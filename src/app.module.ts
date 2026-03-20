import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApisModule } from './apis/apis.module';
import { CreateData } from './apis/entities/createData.entity';
import { Api } from './apis/entities/api.entity';
import { ArmyfestivalModule } from './armyfestival/armyfestival.module';
import { Armyfestival } from './armyfestival/entities/armyfestival.entity';
import { AdminauthModule } from './adminauth/adminauth.module';
import { RedisModule } from './redis.module';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    RedisModule,
    CacheModule.register({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        // ttl:0 //영구저장 할 예정임.(절대 안바뀌는 데이터만 저장)
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: 5432,
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        entities: [
          __dirname + '/apis/entities/*.entity{.ts,.js}',
          __dirname + '/armyfestival/entities/*.entity{.ts,.js}',
          __dirname + '/adminauth/entities/*.entity{.ts,.js}',
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        ssl:
          configService.get<string>('DB_SSL_REQUIRED') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    ApisModule,
    TypeOrmModule.forFeature([CreateData, Armyfestival]),
    ArmyfestivalModule,
    AdminauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('>>>>>Vecel NeonDB Connected<<<<<');
  }
}
