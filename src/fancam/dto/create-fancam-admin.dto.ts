import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateFancamAdminDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  iconImg: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  churl?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsISO8601()
  uploadDate: string;
}
