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
      return await paginate(query, this.fancamRepo, {
        sortableColumns,
        defaultSortBy,
        searchableColumns,
        filterableColumns: {
          tag: [FilterOperator.EQ],
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
