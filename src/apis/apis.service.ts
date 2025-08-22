import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { ApproveDto } from './dto/approve-request.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { Axios, AxiosError } from 'axios';
import { FcnCamApi, FcnCamType } from './entities/fanCameapi.entity';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ApisService {
  private readonly logger = new Logger(ApisService.name);
  constructor(
    @InjectRepository(FcnCamApi)
    private fanCameApiRepository: Repository<FcnCamApi>,
  ) {}
  // 유저가 이거 추가해주세요 요청
  async createUserRequest(createApiDto: CreateApiDto) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = createApiDto.url.match(regex);
    if (!match) {
      throw new ConflictException({
        message: `올바르지않은 URL 형식 입니다.`,
      });
    }
    const videoId = match[1];
    const vidUrl = `https://youtu.be/${videoId}`;
    try {
      const finds = await this.fanCameApiRepository.findOne({
        where: { url: vidUrl },
      });
      console.log(finds);
      if (finds) {
        this.logger.warn(
          `경고: 동영상 URL이 이미 존재합니다: ${createApiDto.url}. 기존 데이터를 반환합니다.`,
        );
        console.log(finds);

        throw new ConflictException({
          message: `${finds.title}는 이미 존재하는 동영상 이거나 요청이 완료된 동영상 입니다.`,
        });
      }

      if (!finds) {
        //유튜브 API를 활용하여 필요한 양식 가공
        // const regex =
        //   /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        // const match = createApiDto.url.match(regex);
        // const videoId = match ? match[1] : null;
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.API_KEY_YTB}`;
        const response = await axios.get(url);
        const data = response.data;
        if (data.items && data.items.length > 0) {
          this.logger.log('데이터 삽입 시작!!');
          const thumbnails = data.items[0].snippet.thumbnails;
          const iconImg =
            thumbnails.maxres?.url ||
            thumbnails.standard?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default?.url||"썸네일 직접추가"

          const inputData = this.fanCameApiRepository.create({
            title: data.items[0].snippet.title,
            url: vidUrl,
            iconImg: iconImg,
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

  // find는 모두 페이지 네이션을 적용합니다.(예정)
  // 유저의 모든 요청사항을 가져옴
  async findAll() {
    // 타입가드를 적용
    const sortableColumns: FcnCamType[] = ['uploadDate'];
    const defaultSortBy: [FcnCamType, 'ASC' | 'DESC'][] = [
      ['uploadDate', 'ASC'],
    ];
    const searchableColumns: FcnCamType[] = ['title'];

    const customQurty = {
      sortableColumns: sortableColumns, // 정렬 가능한 컬럼
      defaultSortBy: defaultSortBy, // 기본 정렬 방식
      searchableColumns: searchableColumns, // 검색 가능한 컬럼
      //필터 조건은 삭제
    };
    const emptyQuery: PaginateQuery = {
      path: '',
    };
    const qury = await paginate(
      emptyQuery,
      this.fanCameApiRepository,
      customQurty,
    );
    console.log(process.env.NODE_ENV, process.env.API_KEY);

    return qury;
  }

  async findFilter(query: PaginateQuery) {
    // 타입가드를 적용
    const sortableColumns: FcnCamType[] = ['uploadDate'];
    const defaultSortBy: [FcnCamType, 'ASC' | 'DESC'][] = [
      ['uploadDate', 'ASC'],
    ];
    const searchableColumns: FcnCamType[] = ['title'];

    const customQurty = {
      sortableColumns: sortableColumns, // 정렬 가능한 컬럼
      defaultSortBy: defaultSortBy, // 기본 정렬 방식
      searchableColumns: searchableColumns, // 검색 가능한 컬럼
      filterableColumns: {
        // 필터, 이거없으면 필터링이 안됨
        approve: [FilterOperator.EQ],
      },
    };
    console.log('asdasdasdas');

    const qury = await paginate(query, this.fanCameApiRepository, customQurty);
    return qury;
  }
}
