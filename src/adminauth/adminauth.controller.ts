import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminauthService } from './adminauth.service';
import { CreateAdminauthDto } from './dto/create-adminauth.dto';
import { UpdateAdminauthDto } from './dto/update-adminauth.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/jwt-auth.guard';

@Controller('adminauth')
export class AdminauthController {
  constructor(private readonly adminauthService: AdminauthService) {}

  @Post('/signupadm')
  signupForAdmin(@Body() createAdminauthDto: CreateAdminauthDto) {
    console.log('THIS');
    return this.adminauthService.signUpAdmin(createAdminauthDto);
  }

  @Post('/loginadm')
  @HttpCode(HttpStatus.OK) // 성공 시 HTTP 200
  async loginForAdmin(
    @Body() createAdminauthDto: CreateAdminauthDto,
    @Res() res: Response,
  ) {
    const token = await this.adminauthService.loginAdmin(createAdminauthDto);
    res.cookie('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3, // 3시간,
      secure: true,
    });
    return res.send({ message: '로그인 성공' });
  }

  @Post('/logoutAdmin')
  @UseGuards(JwtGuard)
  logOutAdmin(@Req() req) {
    return this.adminauthService.logOutAdmin(req.userid.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminauthDto: UpdateAdminauthDto,
  ) {
    return this.adminauthService.update(+id, updateAdminauthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminauthService.remove(+id);
  }
}
