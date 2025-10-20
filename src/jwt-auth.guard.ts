import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS') private readonly redisClient: Redis,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqToken = context.switchToHttp().getRequest();
    const token = reqToken.cookies['access_token'];
    if (!token) throw new UnauthorizedException('no Token Error');
    try {
      const payload = this.jwtService.verify(token.access_token);
      const id = payload.id;
      const validToken = await this.redisClient.get(`jwt:${id}`);

      if (!validToken || validToken !== token.access_token) {
        //토큰 검증이 실패하면 거부처리
        throw new UnauthorizedException('access denied');
      }
      //성공하면 id반환.
      reqToken.userid = { id };
      console.log('>>>>>>', reqToken.userid);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token, access denied');
    }
  }
}
