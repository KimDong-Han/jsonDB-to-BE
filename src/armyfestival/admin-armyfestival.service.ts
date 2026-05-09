import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Armyfestival, ArmyFestivalType } from './entities/armyfestival.entity';
import { CreateArmyAdminDto } from './dto/create-army-admin.dto';
import { UpdateArmyAdminDto } from './dto/update-army-admin.dto';

@Injectable()
export class AdminArmyfestivalService {
  constructor(
    @InjectRepository(Armyfestival)
    private readonly armyRepo: Repository<Armyfestival>,
  ) {}

  async list(query: PaginateQuery, includeHidden = false) {
    const sortableColumns: ArmyFestivalType[] = [
      'uploadDate',
      'createdAt',
      'updatedAt',
    ];
    const defaultSortBy: [ArmyFestivalType, 'ASC' | 'DESC'][] = [
      ['createdAt', 'DESC'],
    ];
    const searchableColumns: ArmyFestivalType[] = ['title', 'tag'];
    return paginate(query, this.armyRepo, {
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
    const item = await this.armyRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    return item;
  }

  async create(dto: CreateArmyAdminDto) {
    const dup = await this.armyRepo.findOne({ where: { url: dto.url } });
    if (dup) throw new ConflictException('이미 존재하는 URL입니다.');
    const created = this.armyRepo.create({
      title: dto.title,
      url: dto.url,
      iconImg: dto.iconImg,
      tag: dto.tag ?? 'none',
      uploadDate: new Date(dto.uploadDate),
    });
    return this.armyRepo.save(created);
  }

  async update(id: string, dto: UpdateArmyAdminDto) {
    const target = await this.armyRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    if (dto.url && dto.url !== target.url) {
      const dup = await this.armyRepo.findOne({ where: { url: dto.url } });
      if (dup) throw new ConflictException('이미 존재하는 URL입니다.');
    }
    if (dto.title !== undefined) target.title = dto.title;
    if (dto.url !== undefined) target.url = dto.url;
    if (dto.iconImg !== undefined) target.iconImg = dto.iconImg;
    if (dto.tag !== undefined) target.tag = dto.tag;
    if (dto.uploadDate !== undefined) {
      target.uploadDate = new Date(dto.uploadDate);
    }
    return this.armyRepo.save(target);
  }

  async remove(id: string) {
    const target = await this.armyRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    target.viewStatus = false;
    const saved = await this.armyRepo.save(target);
    return { hidden: true, item: saved };
  }

  async restore(id: string) {
    const target = await this.armyRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    target.viewStatus = true;
    const saved = await this.armyRepo.save(target);
    return { restored: true, item: saved };
  }

  async hardRemove(id: string) {
    const result = await this.armyRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('해당 영상을 찾을 수 없습니다.');
    }
    return { deleted: true };
  }
}
