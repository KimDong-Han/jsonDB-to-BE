import { PartialType } from '@nestjs/mapped-types';
import { CreateArmyfestivalDto } from './create-armyfestival.dto';

export class UpdateArmyfestivalDto extends PartialType(CreateArmyfestivalDto) {}
