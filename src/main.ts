import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성(필드)은 자동으로 제거됩니다.
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 요청에 포함되면 오류를 발생시킵니다. (강력 권장!)
      transform: true, // 요청 데이터를 DTO 클래스 인스턴스로 자동 변환합니다. (타입 검사에 핵심!)
    }),
  );
  // app.setGlobalPrefix('apis');
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  console.log(process.env.NODE_ENV, process.env.API_KEY);
  await app.listen(process.env.PORT ?? 3000); //모든설정이 끝난뒤 요청을받아야함
}
bootstrap();
