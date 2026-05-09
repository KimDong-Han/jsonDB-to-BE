import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtGuard } from 'src/jwt-auth.guard';
import { AdminFancamService } from './admin-fancam.service';
import { CreateFancamAdminDto } from './dto/create-fancam-admin.dto';
import { UpdateFancamAdminDto } from './dto/update-fancam-admin.dto';

@Controller('fancam/admin')
@UseGuards(JwtGuard)
export class AdminFancamController {
  constructor(private readonly service: AdminFancamService) {}

  @Get()
  list(@Paginate() query: PaginateQuery) {
    return this.service.list(query);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateFancamAdminDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateFancamAdminDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
