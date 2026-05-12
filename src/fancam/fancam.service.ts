import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Fancam, FancamType } from './entities/fancam.entity';

@Injectable()
export class FancamService {
  constructor(
    @InjectRepository(Fancam)
    private readonly fancamRepo: Repository<Fancam>,
  ) {}

  async list(query: PaginateQuery) {
    const sortableColumns: FancamType[] = ['uploadDate'];
    const defaultSortBy: [FancamType, 'ASC' | 'DESC'][] = query.sortBy
      ? []
      : [['uploadDate', 'ASC']];
    const searchableColumns: FancamType[] = ['title', 'source'];
    try {
      const qb = this.fancamRepo
        .createQueryBuilder('fancam')
        .leftJoinAndSelect('fancam.eventTag', 'eventTag')
        .where('fancam.viewStatus = :v', { v: true })
        .andWhere(
          '(fancam.eventTagId IS NULL OR eventTag.viewStatus = true)',
        );

      return await paginate(query, qb, {
        sortableColumns,
        defaultSortBy,
        searchableColumns,
        filterableColumns: {
          tag: [FilterOperator.EQ],
          eventTagId: [FilterOperator.EQ],
          uploadDate: [FilterOperator.BTW],
        },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: '잠시 후 다시 시도해주세요.',
        detail: error instanceof Error ? error.message : error,
      });
    }
  }
}
