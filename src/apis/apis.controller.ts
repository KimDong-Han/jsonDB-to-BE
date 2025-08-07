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

@Controller('apis')
export class ApisController {
  createDataRepository: any;
  constructor(private readonly apisService: ApisService) {}

  // @Post('/requetVideo')
  // @HttpCode(HttpStatus.CREATED) // 성공 시 HTTP 201 Created 상태 코드 설정
  // async create(@Body() createApiDto: CreateApiDto) {
  //   const apiCall = await this.apisService.requestUserInsert(createApiDto);
  //   return apiCall;
  // }
  @Post('/requetUpload')
  @HttpCode(HttpStatus.CREATED) // 성공 시 HTTP 201 Created 상태 코드 설정
  @UseGuards(AuthGuard)
  async userReq(@Body() createApiDto: CreateApiDto) {
    const apiCall = await this.apisService.requestFanCamInsert(createApiDto);
    return apiCall;
  }

  @Post('/approveReq')
  @HttpCode(HttpStatus.CREATED) // 성공 시 HTTP 201 Created 상태 코드 설정
  @UseGuards(AuthGuard)
  async approve(@Body() approveDto: ApproveDto) {
    const apiCall = await this.apisService.updateRequestApprove(approveDto);
    return apiCall;
  }

  @Get()
  findAll() {
    return this.apisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiDto: UpdateApiDto) {
    return this.apisService.update(+id, updateApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apisService.remove(+id);
  }
}
