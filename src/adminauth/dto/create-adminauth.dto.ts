import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminauthDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  permission: string = 'subAdmin';
}
