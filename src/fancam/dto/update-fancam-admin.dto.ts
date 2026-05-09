import { PartialType } from '@nestjs/mapped-types';
import { CreateFancamAdminDto } from './create-fancam-admin.dto';

export class UpdateFancamAdminDto extends PartialType(CreateFancamAdminDto) {}
