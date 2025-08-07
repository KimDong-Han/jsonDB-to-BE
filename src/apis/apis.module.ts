import { Module } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApisController } from './apis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import { FcnCamApi } from './entities/fanCameapi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Api, FcnCamApi])], // Api 엔티티를 ApisModule에 등록
  controllers: [ApisController],
  providers: [ApisService],
  exports: [ApisService, TypeOrmModule.forFeature([Api, FcnCamApi])], // 다른 모듈에서 ApisService를 주입받거나, ApiRepository를 직접 사용해야 한다면 exports에 추가 (필요시)
})
export class ApisModule {}
