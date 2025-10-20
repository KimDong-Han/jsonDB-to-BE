import { Module } from '@nestjs/common';
import { AdminauthService } from './adminauth.service';
import { AdminauthController } from './adminauth.controller';
import { signup } from './entities/signup.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([signup]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, RedisModule],
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
  controllers: [AdminauthController],
  providers: [AdminauthService],
})
export class AdminauthModule {}
