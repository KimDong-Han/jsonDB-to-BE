import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApisModule } from './apis/apis.module';
import { CreateData } from './apis/entities/createData.entity';
import { Api } from './apis/entities/api.entity';
import { ApisController } from './apis/apis.controller';

@Module({
  imports: [
    // 해당 부분은 환경변수를 이 프로젝트 전역에서 사용할수있도록 한다
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule을 임포트합니다.
      inject: [ConfigService], // ConfigService를 주입받아 환경 변수에 접근합니다.
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: 5432,
        username: configService.get<string>('PGUSER'), // 제공된 PGUSER 환경 변수 사용
        password: configService.get<string>('PGPASSWORD'), // 제공된 PGPASSWORD 환경 변수 사용
        database: configService.get<string>('PGDATABASE'), // 제공된 PGDATA
        entities: [__dirname + '/apis/entities/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        ssl: configService.get<boolean>('DB_SSL_REQUIRED')
          ? { rejectUnauthorized: false }
          : true,
      }),
    }),
    ApisModule,
    TypeOrmModule.forFeature([CreateData]),
  ],
  controllers: [AppController, ApisController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // NestJS의 내장 Logger를 사용합니다. 컨텍스트를 'AppModule'로 지정하여 로그 출처를 명확히 합니다.
  private readonly logger = new Logger(AppModule.name);

  // 모든 모듈이 초기화된 후에 이 메서드가 호출됩니다.
  onModuleInit() {
    this.logger.log('>>>>>Vecel NeonDB Connected<<<<<');
    // 필요하다면 여기에 추가적인 DB 연결 확인 로직을 넣을 수도 있습니다.
    // 예: 특정 엔티티의 레포지토리를 주입받아 간단한 쿼리를 날려보는 등
  }
}
