import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res: Response = context.getArgByIndex(1);

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return {
            status: res.statusCode,
            results: data[0],
            count: data[1],
          };
        } else {
          return {
            status: res.statusCode,
            result: data,
          };
        }
      }),
    );
  }
}
