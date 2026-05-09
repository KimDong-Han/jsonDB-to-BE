import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventTag } from './entities/event-tag.entity';
import { signup } from '../adminauth/entities/signup.entity';
import { EventTagService } from './event-tag.service';
import { EventTagController } from './event-tag.controller';
import { AdminEventTagService } from './admin-event-tag.service';
import { AdminEventTagController } from './admin-event-tag.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTag, signup]),
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
  controllers: [EventTagController, AdminEventTagController],
  providers: [EventTagService, AdminEventTagService],
})
export class EventTagModule {}
