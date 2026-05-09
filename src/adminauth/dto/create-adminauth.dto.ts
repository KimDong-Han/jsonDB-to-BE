import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminauthDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
