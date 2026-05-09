import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventTag } from './entities/event-tag.entity';

@Injectable()
export class EventTagService {
  constructor(
    @InjectRepository(EventTag)
    private readonly repo: Repository<EventTag>,
  ) {}

  list() {
    return this.repo.find({
      where: { viewStatus: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
      select: ['id', 'name', 'sortOrder'],
    });
  }
}
