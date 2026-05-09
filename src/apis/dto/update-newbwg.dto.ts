import { PartialType } from '@nestjs/mapped-types';
import { CreateNewbwgDto } from './create-newbwg.dto';

export class UpdateNewbwgDto extends PartialType(CreateNewbwgDto) {}
