import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventTagService } from './event-tag.service';

@Controller('event-tag')
export class EventTagController {
  constructor(private readonly service: EventTagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list() {
    return this.service.list();
  }
}
