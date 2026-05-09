import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTagAdminDto } from './create-event-tag-admin.dto';

export class UpdateEventTagAdminDto extends PartialType(CreateEventTagAdminDto) {}
