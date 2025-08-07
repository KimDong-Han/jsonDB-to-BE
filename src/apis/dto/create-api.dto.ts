import { IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateApiDto {
  @IsString()
  @IsNotEmpty({ message: 'URL은 필수 입력 값입니다.' })
  @IsUrl({}, { message: '유효한 URL 형식이 아닙니다.' })
  url: string;

  @IsString()
  @IsOptional() // tag는 선택 사항일 수 있습니다. (필수라면 @IsNotEmpty 추가)
  tag?: string;

  @IsString()
  categorys: string;
}
