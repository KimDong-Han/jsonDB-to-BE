import { Module } from '@nestjs/common';
import { ArmyfestivalService } from './armyfestival.service';
import { ArmyfestivalController } from './armyfestival.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Armyfestival } from './entities/armyfestival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Armyfestival])],
  controllers: [ArmyfestivalController],
  providers: [ArmyfestivalService],
})
export class ArmyfestivalModule {}
