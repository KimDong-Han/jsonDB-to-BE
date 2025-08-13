import { PickType } from '@nestjs/mapped-types';
import { IsString, IsUrl, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveDto {
  @IsString()
  @IsNotEmpty({ message: 'URL은 필수 입력 값입니다.' })
  @IsUrl({}, { message: '유효한 URL 형식이 아닙니다.' })
  url: string;

  @IsBoolean()
  isApprove: boolean;
}
