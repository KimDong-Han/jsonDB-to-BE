import { Controller, Get, Post, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 루트 페이지 → 유튜브 영상
  @Get()
  @Header('Content-Type', 'text/html')
  getRoot(): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QWER</title>
        <style>
          body {
            margin:0;
            background:#000;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
          }
        </style>
      </head>
      <body>
        <iframe
          width="960"
          height="540"
          src="https://www.youtube.com/embed/ImuWa3SJulY"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      </body>
    </html>
    `;
  }

  // 기존 API 그대로 유지
  @Get('/dataInsert')
  getHello() {
    return { message: '1!2!QWER!' };
  }

  @Post('/dataInsert/insert')
  insertData(){
    return { message: '1!2!QWER!' };
  }
}