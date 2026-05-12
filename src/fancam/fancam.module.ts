import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Fancam } from './entities/fancam.entity';
import { EventTag } from '../event-tag/entities/event-tag.entity';
import { signup } from '../adminauth/entities/signup.entity';
import { FancamService } from './fancam.service';
import { FancamController } from './fancam.controller';
import { AdminFancamService } from './admin-fancam.service';
import { AdminFancamController } from './admin-fancam.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fancam, EventTag, signup]),
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
  controllers: [FancamController, AdminFancamController],
  providers: [FancamService, AdminFancamService],
})
export class FancamModule {}
