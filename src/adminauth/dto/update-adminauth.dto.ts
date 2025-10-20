import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminauthDto } from './create-adminauth.dto';

export class UpdateAdminauthDto extends PartialType(CreateAdminauthDto) {}
