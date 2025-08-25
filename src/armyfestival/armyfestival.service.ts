import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArmyfestivalDto } from './dto/create-armyfestival.dto';
import { UpdateArmyfestivalDto } from './dto/update-armyfestival.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ArmyFestivalType, Armyfestival } from './entities/armyfestival.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArmyfestivalService {
  constructor(
    @InjectRepository(Armyfestival)
    private armyfestivalRepository: Repository<Armyfestival>,
  ) {}

  async findAllByDate(query: PaginateQuery & { order?: 'ASC' | 'DESC' }) {
    const sortableColumns: ArmyFestivalType[] = ['uploadDate'];
    const defaultSortBy: [ArmyFestivalType, 'ASC' | 'DESC'][] = query.sortBy
      ? []
      : [['uploadDate', 'ASC']];
    const customQuery = {
      sortableColumns,
      defaultSortBy,
    };
    const pageQuery = {
      ...query,
      page: query.page ?? 1,
      limit: query.limit ?? 15,
    };
    try {
      const qury = await paginate(
        pageQuery,
        this.armyfestivalRepository,
        customQuery,
      );

      return qury;
    } catch (error) {
      // NestJS HTTP 예외로 변환
      throw new InternalServerErrorException({
        message: '잠시 후 다시 시도해주세요.',
        detail: error instanceof Error ? error.message : error,
      });
    }
  }
}
