import { Injectable, Logger } from '@nestjs/common';
import * as broadcast from './jsonData/broadcast.json';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoJson } from './types/typs';
import { CreateData } from './apis/entities/createData.entity';
import { Armyfestival } from './armyfestival/entities/armyfestival.entity';
import { Repository } from 'typeorm';
const broadCastData: VideoJson[] = broadcast as VideoJson[];

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name); // Logger도 생성자 밖에서 private readonly로 선언하는 것이 일반적입니다.

  constructor(
    @InjectRepository(CreateData)
    private createDataRepository: Repository<CreateData>,
    @InjectRepository(Armyfestival)
    private armyfestivalRepository: Repository<Armyfestival>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  // 유튜브 테이블에 넣음
  async insertYtbData(): Promise<void> {
    this.logger.log('위문열차 데이터 삽입 시작...(로직 주석처리 완료)');
    // const videoList = broadCastData.map((videoList: VideoJson) => {
    //   return this.armyfestivalRepository.create({
    //     title: videoList.title,
    //     url: videoList.url,
    //     iconImg: videoList.iconImg,
    //     uploadDate: new Date(videoList.uploadDate.$date),
    //     tag: videoList.tag,
    //   });
    // });
    // this.logger.log(videoList);
    // await this.armyfestivalRepository.save(videoList);
  }
}
