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
import { AdminArmyfestivalService } from './admin-armyfestival.service';
import { CreateArmyAdminDto } from './dto/create-army-admin.dto';
import { UpdateArmyAdminDto } from './dto/update-army-admin.dto';

@Controller('army/admin')
@UseGuards(JwtGuard)
export class AdminArmyfestivalController {
  constructor(private readonly service: AdminArmyfestivalService) {}

  @Get()
  list(@Paginate() query: PaginateQuery) {
    return this.service.list(query);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateArmyAdminDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateArmyAdminDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
