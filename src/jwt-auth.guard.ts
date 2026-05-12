import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { signup } from './adminauth/entities/signup.entity';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS') private readonly redisClient: Redis,
    @InjectRepository(signup)
    private readonly adminRepo: Repository<signup>,
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
        throw new UnauthorizedException('access denied');
      }

      const admin = await this.adminRepo.findOne({ where: { adminId: id } });
      if (!admin || admin.permission === 'pending') {
        throw new UnauthorizedException('관리자 승인이 필요합니다.');
      }
      if (!admin || admin.permission === 'holiday') {
        throw new UnauthorizedException('명절에는 쉬십쇼.');
      }
      reqToken.userid = { id };
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid token, access denied');
    }
  }
}
