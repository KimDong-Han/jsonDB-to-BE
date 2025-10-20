import {
  Controller,
  Get,
  Post,
  Body,
  Header,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { ApproveDto } from './dto/approve-request.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import Redis from 'ioredis';

@Controller('apis')
export class ApisController {
  createDataRepository: any;
  constructor(
    private readonly apisService: ApisService,
    @Inject('REDIS') private readonly redisClient: Redis,
  ) {}
  @Post('/requetUpload')
  @HttpCode(HttpStatus.CREATED) // 성공 시 HTTP 201 Created 상태 코드 설정
  @UseGuards(AuthGuard)
  async userReq(@Body() createApiDto: CreateApiDto) {
    const apiCall = await this.apisService.createUserRequest(createApiDto);
    return apiCall;
  }

  @Post('/approveReq')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  @UseGuards(AuthGuard)
  async approve(@Body() approveDto: ApproveDto) {
    const apiCall = await this.apisService.updateRequestApprove(approveDto);

    return apiCall;
  }

  @Get('/allStatus')
  findAll() {
    console.log('kkk');
    return this.apisService.initNewBwgVideoData();
  }
  @Get('/approveStatus')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  @UseGuards(AuthGuard)
  findFilter(@Paginate() query: PaginateQuery) {
    return this.apisService.findFilter(query);
  }

  @Get('/new')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  async newbwg(@Paginate() query: PaginateQuery) {
    if (!query.sortBy) {
      throw new ConflictException('올바르지 않은 접근입니다.');
    }
    const isCache = //1페이지 이고,별도의 필터조건이 없으며 정렬이 ASC일때만 레디스의 데이터를 가져온다, 해당 데이터는 첫페이지 목록들임
      query.page == 1 && !query.filter && query.sortBy[0][1] === 'ASC';
    if (!isCache) {
      //캐싱된 페이지가 아니라면 db조회(서비스로)
      return this.apisService.newBwgPageApi(query);
    }

    const cacheKey = 'newbwg:first';
    const getFirstPage = await this.redisClient.get(cacheKey);
    if (!getFirstPage) {
      return this.apisService.newBwgPageApi(query);
    }
    return JSON.parse(getFirstPage);
  }
  @Post('/tempredis')
  newbwgOnRedis(@Paginate() query: PaginateQuery) {
    return this.apisService.newBwgVideoOnRedis(query);
  }
}
