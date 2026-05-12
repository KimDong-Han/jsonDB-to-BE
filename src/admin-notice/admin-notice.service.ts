import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminNotice } from './entities/admin-notice.entity';

@Injectable()
export class AdminNoticeService {
  constructor(
    @InjectRepository(AdminNotice)
    private readonly repo: Repository<AdminNotice>,
  ) {}

  // viewStatus=true 중 가장 최근 한 건. 없으면 null
  async getLatest(): Promise<AdminNotice | null> {
    return this.repo.findOne({
      where: { viewStatus: true },
      order: { createdAt: 'DESC' },
    });
  }
}
