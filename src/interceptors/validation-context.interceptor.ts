import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * Do không thể inject request vào custom ValidatorConstraint class (issue chung của class-validator và nestjs),
 * Chúng ta sẽ inject user vào request param, body và query để pass với StripContextPipe
 * @see ../../pipes/StripContextPipe.ts
 * @see ../../validators/IsUserOwnVehicle.validator.ts
 */
@Injectable()
export class ValidationContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.params) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request.params.validationContext = {
        user: request.user,
      };
      if (!request.params.token) {
        request.params.token = request.token;
      }
    }
    if (request.body) {
      request.body.validationContext = {
        user: request.user,
      };
      if (!request.body.token) {
        request.body.token = request.token;
      }
    }

    if (request.query) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request.query.validationContext = {
        user: request.user,
      };
      if (!request.query.token) {
        request.query.token = request.token;
      }
    }

    return next.handle();
  }
}
