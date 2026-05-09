import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PreviewUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
