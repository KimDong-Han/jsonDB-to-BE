import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from 'src/auth/auth.guard';
import { FancamService } from './fancam.service';

@Controller('fancam')
export class FancamController {
  constructor(private readonly fancamService: FancamService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  list(@Paginate() query: PaginateQuery) {
    return this.fancamService.list(query);
  }
}
