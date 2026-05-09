import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Fancam, FancamType } from './entities/fancam.entity';
import { CreateFancamAdminDto } from './dto/create-fancam-admin.dto';
import { UpdateFancamAdminDto } from './dto/update-fancam-admin.dto';

@Injectable()
export class AdminFancamService {
  constructor(
    @InjectRepository(Fancam)
    private readonly fancamRepo: Repository<Fancam>,
  ) {}

  async list(query: PaginateQuery, includeHidden = false) {
    const sortableColumns: FancamType[] = [
      'uploadDate',
      'createdAt',
      'updatedAt',
    ];
    const defaultSortBy: [FancamType, 'ASC' | 'DESC'][] = [
      ['createdAt', 'DESC'],
    ];
    const searchableColumns: FancamType[] = ['title', 'tag', 'source'];
    return paginate(query, this.fancamRepo, {
      sortableColumns,
      defaultSortBy,
      searchableColumns,
      ...(includeHidden ? {} : { where: { viewStatus: true } }),
      filterableColumns: {
        tag: [FilterOperator.EQ],
      },
    });
  }

  async get(id: string) {
    const item = await this.fancamRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    return item;
  }

  async create(dto: CreateFancamAdminDto) {
    const dup = await this.fancamRepo.findOne({ where: { url: dto.url } });
    if (dup) throw new ConflictException('이미 존재하는 URL입니다.');
    const created = this.fancamRepo.create({
      title: dto.title,
      url: dto.url,
      iconImg: dto.iconImg,
      source: dto.source ?? '',
      churl: dto.churl ?? '',
      tag: dto.tag ?? 'none',
      uploadDate: new Date(dto.uploadDate),
    });
    return this.fancamRepo.save(created);
  }

  async update(id: string, dto: UpdateFancamAdminDto) {
    const target = await this.fancamRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    if (dto.url && dto.url !== target.url) {
      const dup = await this.fancamRepo.findOne({ where: { url: dto.url } });
      if (dup) throw new ConflictException('이미 존재하는 URL입니다.');
    }
    if (dto.title !== undefined) target.title = dto.title;
    if (dto.url !== undefined) target.url = dto.url;
    if (dto.iconImg !== undefined) target.iconImg = dto.iconImg;
    if (dto.source !== undefined) target.source = dto.source;
    if (dto.churl !== undefined) target.churl = dto.churl;
    if (dto.tag !== undefined) target.tag = dto.tag;
    if (dto.uploadDate !== undefined) {
      target.uploadDate = new Date(dto.uploadDate);
    }
    return this.fancamRepo.save(target);
  }

  async remove(id: string) {
    const target = await this.fancamRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    target.viewStatus = false;
    const saved = await this.fancamRepo.save(target);
    return { hidden: true, item: saved };
  }

  async restore(id: string) {
    const target = await this.fancamRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    target.viewStatus = true;
    const saved = await this.fancamRepo.save(target);
    return { restored: true, item: saved };
  }

  async hardRemove(id: string) {
    const result = await this.fancamRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    }
    return { deleted: true };
  }
}
