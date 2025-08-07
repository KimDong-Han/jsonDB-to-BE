// src/all-exceptions.filter.ts
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch() // 모든 예외를 잡도록 설정
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 예외가 HttpException인지 확인하여 상태 코드 결정
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 예외 메시지 추출
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : 'Internal server error';

    // 서버 로그에 에러 기록
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace available',
      'AllExceptionsFilter',
    );
    // 클라이언트에게 JSON 형태로 에러 응답 전송
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      message: message,
      // 개발 환경에서만 에러 스택을 포함하려면:
      // ...(process.env.NODE_ENV === 'development' && { stack: (exception as any).stack }),
    });
  }
}
