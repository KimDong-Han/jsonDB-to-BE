import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, LessThan, MoreThan, Repository } from 'typeorm';
import { EventTag } from './entities/event-tag.entity';
import { CreateEventTagAdminDto } from './dto/create-event-tag-admin.dto';
import { UpdateEventTagAdminDto } from './dto/update-event-tag-admin.dto';

@Injectable()
export class AdminEventTagService {
  constructor(
    @InjectRepository(EventTag)
    private readonly repo: Repository<EventTag>,
  ) {}

  async list(includeHidden = false, search?: string) {
    const where: Record<string, unknown> = {};
    if (!includeHidden) where.viewStatus = true;
    const trimmed = search?.trim();
    if (trimmed) where.name = ILike(`%${trimmed}%`);
    return this.repo.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async get(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    return item;
  }

  async create(dto: CreateEventTagAdminDto) {
    const name = dto.name.trim();
    if (!name) throw new ConflictException('이름이 비어있습니다.');
    const dup = await this.repo.findOne({ where: { name } });
    if (dup) throw new ConflictException('이미 존재하는 태그입니다.');

    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const max = await this.repo
        .createQueryBuilder('t')
        .select('COALESCE(MAX(t.sortOrder), -1)', 'max')
        .getRawOne<{ max: number }>();
      sortOrder = Number(max?.max ?? -1) + 1;
    }

    const created = this.repo.create({
      name,
      sortOrder,
      viewStatus: dto.viewStatus ?? true,
    });
    return this.repo.save(created);
  }

  async update(id: string, dto: UpdateEventTagAdminDto) {
    const target = await this.repo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) throw new ConflictException('이름이 비어있습니다.');
      if (name !== target.name) {
        const dup = await this.repo.findOne({ where: { name } });
        if (dup) throw new ConflictException('이미 존재하는 태그입니다.');
      }
      target.name = name;
    }
    if (dto.sortOrder !== undefined) target.sortOrder = dto.sortOrder;
    if (dto.viewStatus !== undefined) target.viewStatus = dto.viewStatus;

    return this.repo.save(target);
  }

  async remove(id: string) {
    const result = await this.repo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    }
    return { deleted: true };
  }

  async move(id: string, dir: 'up' | 'down') {
    const current = await this.repo.findOne({ where: { id } });
    if (!current) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');

    const neighbor = await this.repo.findOne({
      where: {
        sortOrder:
          dir === 'up'
            ? LessThan(current.sortOrder)
            : MoreThan(current.sortOrder),
      },
      order: { sortOrder: dir === 'up' ? 'DESC' : 'ASC' },
    });
    if (!neighbor) return current; // 이미 최상단/최하단

    await this.repo.manager.transaction(async (manager) => {
      const tmp = current.sortOrder;
      current.sortOrder = neighbor.sortOrder;
      neighbor.sortOrder = tmp;
      await manager.save(EventTag, [current, neighbor]);
    });
    return current;
  }
}
