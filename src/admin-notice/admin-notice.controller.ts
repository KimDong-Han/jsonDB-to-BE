import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/jwt-auth.guard';
import { AdminNoticeService } from './admin-notice.service';

@Controller('admin-notice')
@UseGuards(JwtGuard)
export class AdminNoticeController {
  constructor(private readonly service: AdminNoticeService) {}

  @Get('latest')
  getLatest() {
    return this.service.getLatest();
  }
}
