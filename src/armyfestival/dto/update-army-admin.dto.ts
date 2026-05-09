import { PartialType } from '@nestjs/mapped-types';
import { CreateArmyAdminDto } from './create-army-admin.dto';

export class UpdateArmyAdminDto extends PartialType(CreateArmyAdminDto) {}
