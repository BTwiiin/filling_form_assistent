import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `Request: ${method} ${url} - User-Agent: ${userAgent} - Body: ${JSON.stringify(body)}`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - startTime;
          
          // Log response
          this.logger.log(
            `Response: ${method} ${url} - Status: ${response.statusCode} - Time: ${delay}ms`
          );
        },
        error: (error) => {
          const delay = Date.now() - startTime;
          
          // Log error
          this.logger.error(
            `Error: ${method} ${url} - Status: ${error.status} - Time: ${delay}ms - Message: ${error.message}`
          );
        },
      }),
    );
  }
} 