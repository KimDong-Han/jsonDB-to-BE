import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { ApproveDto } from './dto/approve-request.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Api } from './entities/api.entity';
import axios, { Axios, AxiosError } from 'axios';
import { VideoJson } from 'src/types/typs';
import { ConfigService } from '@nestjs/config'; // ConfigService 임포트
import { FcnCamApi } from './entities/fanCameapi.entity';

const API_KEY = 'AIzaSyCVCbk0Vss9SL_grPReEKJhbtHVZ87Eq-k';
@Injectable()
export class ApisService {
  private readonly logger = new Logger(ApisService.name); // Logger도 생성자 밖에서 private readonly로 선언하는 것이 일반적입니다.
  constructor(
    @InjectRepository(Api)
    private apiRepository: Repository<Api>,
    @InjectRepository(FcnCamApi)
    private fanCameApiRepository: Repository<FcnCamApi>,
  ) {}
  // 임시
  async requestUserInsert(createApiDto: CreateApiDto) {
    this.logger.log('탐색시작');
    try {
      const finds = await this.apiRepository.findOne({
        where: { url: createApiDto.url },
      });
      // console.log(finds);
      if (finds) {
        this.logger.warn(
          `[Vercel] 동영상 URL이 이미 존재합니다: ${createApiDto.url}. 기존 데이터를 반환합니다.`,
        );
        console.log(finds);
        throw new ConflictException(
          `${finds.title}는이미 존재하는 동영상 입니다.`,
        );
      }

      if (!finds) {
        const regex =
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = createApiDto.url.match(regex);
        const videoId = match ? match[1] : null;
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.API_KEY_YTB}`;
        const response = await axios.get(url);
        const data = response.data;
        if (data.items && data.items.length > 0) {
          this.logger.log('데이터 삽입 시작');
          const inputData = this.apiRepository.create({
            title: data.items[0].snippet.title,
            url: createApiDto.url,
            iconImg: data.items[0].snippet.thumbnails.maxres.url,
            tag: createApiDto.tag!,
            uploadDate: new Date(data.items[0].snippet.publishedAt),
            // chUrl:https:"www.youtube.com/channel/"+data.items[0].snippet.channelId 여기선 안씀
          });
          // console.log(data.items[0].snippet);
          // const inpitDataObj = await this.apiRepository.save(inputData);
          // return inpitDataObj;
        } else {
          throw new NotFoundException(
            '동영상을 찾을 수 없습니다, URL을 다시 확인해주세요. [https://youtu.be/WRIjMFXLfwo]같은 양식만 허용합니다.',
          );
        }
      }
    } catch (error) {
      //중복된 데이터를 넣으려고 할때
      // console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // 모든 Axios 에러는 InternalServerErrorException으로 처리
        throw new InternalServerErrorException(
          'youTube API호출중에 오류가 발생했습니다.',
        );
      }
    }
    // console.log(finds);
  }

  // 유저가 요청한 리스트
  async requestFanCamInsert(createApiDto: CreateApiDto) {
    this.logger.log('탐색시작?');
    try {
      const finds = await this.fanCameApiRepository.findOne({
        where: { url: createApiDto.url },
      });
      console.log(finds);
      if (finds) {
        this.logger.warn(
          `[Vercel] 동영상 URL이 이미 존재합니다: ${createApiDto.url}. 기존 데이터를 반환합니다.`,
        );
        console.log(finds);

        throw new ConflictException({
          message: `${finds.title}는 이미 존재하는 동영상 이거나 요청이 완료된 동영상 입니다.`,
        });
      }

      if (!finds) {
        const regex =
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = createApiDto.url.match(regex);
        const videoId = match ? match[1] : null;
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.API_KEY_YTB}`;
        const response = await axios.get(url);
        const data = response.data;
        if (data.items && data.items.length > 0) {
          this.logger.log('데이터 삽입 시작');
          const inputData = this.fanCameApiRepository.create({
            title: data.items[0].snippet.title,
            url: createApiDto.url,
            iconImg: data.items[0].snippet.thumbnails.maxres.url,
            source: data.items[0].snippet.channelTitle,
            tag: createApiDto.tag!,
            uploadDate: new Date(data.items[0].snippet.publishedAt),
            churl:
              'https://www.youtube.com/channel/' +
              data.items[0].snippet.channelId,
          });
          const inpitDataObj = await this.fanCameApiRepository.save(inputData);
          const inDbData = finds;
          return { inpitDataObj, inDbData };
        } else {
          throw new NotFoundException(
            '동영상을 찾을 수 없습니다, URL을 다시 확인해주세요. [https://youtu.be/WRIjMFXLfwo]같은 양식만 허용합니다.',
          );
        }
      }
    } catch (error) {
      //중복된 데이터를 넣으려고 할때
      // console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // 모든 Axios 에러는 InternalServerErrorException으로 처리
        throw new InternalServerErrorException(
          'youTube API호출중에 오류가 발생했습니다.',
        );
      }
    }
    // console.log(finds);
  }
  async updateRequestApprove(approveDto: ApproveDto) {
    try {
      const update = await this.fanCameApiRepository.update(
        { url: approveDto.url },
        { approve: approveDto.isApprove },
      );

      if (update.affected === 0) {
        this.logger.warn(
          `No video found with URL: ${approveDto.url} to update.`,
        );
        return {
          message: '해당 URL의 동영상을 찾을 수 없어 업데이트하지 못했습니다.',
          updated: false,
        };
      }
      return {
        message: '상태 변경 완료',
        updated: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // 모든 Axios 에러는 InternalServerErrorException으로 처리
        throw new InternalServerErrorException('데이터 업데이트간 오류 발생');
      }
    }
    // console.log(finds);
  }

  findAll() {
    return `This action returns all apis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} api`;
  }

  update(id: number, updateApiDto: UpdateApiDto) {
    return `This action updates a #${id} api`;
  }

  remove(id: number) {
    return `This action removes a #${id} api`;
  }
}
