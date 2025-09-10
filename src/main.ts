import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.setGlobalPrefix('apis');
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableCors({
    origin: [
      'https://www.qwerflix.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ], // 프론트 도메인
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(process.env.PORT ?? 3000); //모든설정이 끝난뒤 요청을받아야함
}
bootstrap();
