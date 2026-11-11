import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // 클라이언트가 보낸 API Key

    // 환경 변수에서 설정된 유효한 API Key Get
    const validApiKey = this.configService.get<string>('SECRET_API_KEY');
    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('유효하지 않은 API Key입니다.');
    }
    return true;
  }
}
