import {
  Controller,
  Get,
  Post,
  Body,
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
} from '@nestjs/common';
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { ApproveDto } from './dto/approve-request.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('apis')
export class ApisController {
  createDataRepository: any;
  constructor(private readonly apisService: ApisService) {}
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
    return this.apisService.findAll();
  }
  @Get('/approveStatus')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  @UseGuards(AuthGuard)
  findFilter(@Paginate() query: PaginateQuery) {
    return this.apisService.findFilter(query);
  }
}
