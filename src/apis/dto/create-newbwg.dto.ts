import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateNewbwgDto {
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
  tag?: string;

  @IsISO8601()
  uploadDate: string;
}
