import { Module } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApisController } from './apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcnCamApi } from './entities/fanCameapi.entity';
import { newbwg } from './entities/newbwg.entity';
import { signup } from '../adminauth/entities/signup.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminApisController } from './admin-apis.controller';
import { AdminApisService } from './admin-apis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FcnCamApi, newbwg, signup]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn:
            Number(configService.get<string>('JWT_EXPIRES_IN')) || 3600,
        },
      }),
    }),
  ],
  controllers: [ApisController, AdminApisController],
  providers: [ApisService, AdminApisService],
  exports: [ApisService, TypeOrmModule.forFeature([FcnCamApi])],
})
export class ApisModule {}
