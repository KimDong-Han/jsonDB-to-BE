import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // 클라이언트가 보낸 API Key
    console.log('>>>>>>', process.env.NODE_ENV, process.env.SECRET_API_KEY);

    this.logger.log(`Received API Key: ${!!apiKey}`); // 키를 직접 노출하지않고 유무만 로그에 찍음
    // 사실 이거도 찍을 필요가 있나 싶음.

    // 환경 변수에서 설정된 유효한 API Key Get
    const validApiKey = this.configService.get<string>('SECRET_API_KEY');
    if (!apiKey || apiKey !== validApiKey) {
      this.logger.warn(`Unauthorized access attempt with API Key: ${!!apiKey}`);
      // 키를 직접 노출하지않고 유무만 로그에 찍음
      throw new UnauthorizedException('유효하지 않은 API Key입니다.');
    }

    this.logger.log('API Key authentication successful.');
    return true;
  }
}
