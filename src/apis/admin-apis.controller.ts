import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtGuard } from 'src/jwt-auth.guard';
import { AdminApisService } from './admin-apis.service';
import { CreateNewbwgDto } from './dto/create-newbwg.dto';
import { UpdateNewbwgDto } from './dto/update-newbwg.dto';
import { PreviewUrlDto } from './dto/preview-url.dto';

@Controller('apis/admin')
@UseGuards(JwtGuard)
export class AdminApisController {
  constructor(private readonly adminApisService: AdminApisService) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  preview(@Body() dto: PreviewUrlDto) {
    return this.adminApisService.previewYoutube(dto);
  }

  @Get('newbwg')
  list(
    @Paginate() query: PaginateQuery,
    @Query('includeHidden') includeHidden?: string,
  ) {
    return this.adminApisService.listNewbwg(query, includeHidden === 'true');
  }

  @Get('newbwg/:id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminApisService.getNewbwg(id);
  }

  @Post('newbwg')
  create(@Body() dto: CreateNewbwgDto) {
    return this.adminApisService.createNewbwg(dto);
  }

  @Patch('newbwg/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateNewbwgDto,
  ) {
    return this.adminApisService.updateNewbwg(id, dto);
  }

  @Delete('newbwg/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminApisService.deleteNewbwg(id);
  }

  @Patch('newbwg/:id/restore')
  restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminApisService.restoreNewbwg(id);
  }

  @Delete('newbwg/:id/hard')
  hardRemove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.adminApisService.hardDeleteNewbwg(id);
  }
}
