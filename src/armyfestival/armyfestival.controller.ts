import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ArmyfestivalService } from './armyfestival.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('army')
export class ArmyfestivalController {
  constructor(private readonly armyfestivalService: ArmyfestivalService) {}

  @Get('/kforce')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  @UseGuards(AuthGuard)
  findAll(@Paginate() query: PaginateQuery & { order?: 'ASC' | 'DESC' }) {
    return this.armyfestivalService.findAllByDate(query);
  }
}
