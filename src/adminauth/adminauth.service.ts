import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminauthDto } from './dto/create-adminauth.dto';
import { UpdateAdminauthDto } from './dto/update-adminauth.dto';
import * as bcrypt from 'bcrypt';
import { signup } from './entities/signup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
@Injectable()
export class AdminauthService {
  constructor(
    @InjectRepository(signup)
    private admin: Repository<signup>,
    private readonly jwtService: JwtService,
    @Inject('REDIS') private readonly redisClient: Redis,
  ) {}
  /**회원가입 API */
  async signUpAdmin(createAdminauthDto: CreateAdminauthDto) {
    const { id, password, permission } = createAdminauthDto;
    try {
      const saltSeed = 10;
      const hashedPw = await bcrypt.hash(password, saltSeed);
      const checkId = await this.admin.findOne({ where: { adminId: id } });
      console.log(checkId);
      if (checkId) {
        throw new ConflictException('중복된 아이디는 사용이 불가능합니다.');
      }
      const insertAdmin = this.admin.create({
        adminId: id,
        pw: hashedPw,
      });
      const result = await this.admin.save(insertAdmin);
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '회원가입 과정에서 오류가 발생하였습니다. 잠시후 다시 시도하세요.',
      );
    }
  }
  /**로그인 API */
  async loginAdmin(createAdminauthDto: CreateAdminauthDto) {
    const { id, password } = createAdminauthDto;
    try {
      const findId = await this.admin.findOne({
        where: { adminId: id },
      });
      if (!findId) {
        throw new ConflictException('이용자를 찾을 수 없습니다.');
      }
      const validatePw = await bcrypt.compare(password, findId.pw);
      if (!validatePw) {
        throw new UnauthorizedException('잘못된 아이디 또는 비밀번호입니다.');
      }
      const payload = { id: findId.adminId };
      const access_token = this.jwtService.sign(payload);
      console.log(payload);
      const savereids = await this.redisClient.set(
        `jwt:${id}`,
        access_token,
        'EX',
        3600,
      );
      const readredis = await this.redisClient.get(`jwt:${id}`);
      return { access_token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '로그인 단계에서 오류가 발생 하였습니다.',
      );
    }
  }
  async logOutAdmin(id: string) {
    try {
      const logout = await this.redisClient.del(`jwt:${id}`);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        '이미 로그아웃 되었거나 오류가 발생하였습니다.',
      );
    }
  }
  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  findOne(id: number) {
    return `This action returns a #${id} adminauth`;
  }

  update(id: number, updateAdminauthDto: UpdateAdminauthDto) {
    return `This action updates a #${id} adminauth`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminauth`;
  }
}
