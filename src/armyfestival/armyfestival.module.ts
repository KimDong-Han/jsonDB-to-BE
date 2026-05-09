import { Module } from '@nestjs/common';
import { ArmyfestivalService } from './armyfestival.service';
import { ArmyfestivalController } from './armyfestival.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Armyfestival } from './entities/armyfestival.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminArmyfestivalController } from './admin-armyfestival.controller';
import { AdminArmyfestivalService } from './admin-armyfestival.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Armyfestival]),
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
  controllers: [ArmyfestivalController, AdminArmyfestivalController],
  providers: [ArmyfestivalService, AdminArmyfestivalService],
})
export class ArmyfestivalModule {}
