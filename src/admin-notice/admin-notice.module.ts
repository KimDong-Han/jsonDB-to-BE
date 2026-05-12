import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminNotice } from './entities/admin-notice.entity';
import { signup } from '../adminauth/entities/signup.entity';
import { AdminNoticeService } from './admin-notice.service';
import { AdminNoticeController } from './admin-notice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminNotice, signup]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn:
            Number(configService.get<string>('JWT_EXPIRES_IN')) || 7200,
        },
      }),
    }),
  ],
  controllers: [AdminNoticeController],
  providers: [AdminNoticeService],
})
export class AdminNoticeModule {}
