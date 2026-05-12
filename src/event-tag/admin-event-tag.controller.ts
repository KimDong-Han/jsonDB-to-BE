import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/jwt-auth.guard';
import { AdminEventTagService } from './admin-event-tag.service';
import { CreateEventTagAdminDto } from './dto/create-event-tag-admin.dto';
import { UpdateEventTagAdminDto } from './dto/update-event-tag-admin.dto';

@Controller('event-tag/admin')
@UseGuards(JwtGuard)
export class AdminEventTagController {
  constructor(private readonly service: AdminEventTagService) {}

  @Get()
  list(
    @Query('includeHidden') includeHidden?: string,
    @Query('search') search?: string,
  ) {
    return this.service.list(includeHidden === 'true', search);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateEventTagAdminDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEventTagAdminDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/move')
  move(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('dir') dir: string,
  ) {
    if (dir !== 'up' && dir !== 'down') {
      throw new BadRequestException('dir must be up or down');
    }
    return this.service.move(id, dir);
  }
}
