import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from '../share/exceptions/validation.exception';
import { ApiErrorResponse } from '../share/error-response';
import { get } from 'lodash';
import { TokenException } from '../share/exceptions/token.exception';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private dontReports: Array<any> = [
    ValidationException,
    NotFoundException,
    TokenException,
  ];

  catch(exception: HttpException | any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logException(exception, request);

    let status = 500,
      error = null;
    const message = this.getExceptionMessage(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    if (exception instanceof ValidationException) {
      error = exception.getResponse();
    }

    const apiErrorResponse: ApiErrorResponse = ApiErrorResponse.create(
      message,
      error,
    );

    response.status(status).json(apiErrorResponse);
  }

  protected getExceptionMessage(exception: HttpException | any): string {
    let message =
      get(exception, 'message') ||
      get(exception, 'response.message') ||
      'Internal Server Error';

    if (exception instanceof ValidationException) {
      message = 'Validation Failed';
    }

    return message;
  }

  private logException(exception: any, request: Request) {
    if (this.shouldReportException(exception)) {
      Logger.error(`${request.method} ${request.url}`, null, 'ExceptionFilter');
      if (process.env.JEST_WORKER_ID == undefined) console.log(exception); //turn off log when testing
    }
  }

  private dontReportException(exception: any) {
    return this.dontReports.some((e) => exception instanceof e);
  }

  private shouldReportException(exception: any) {
    return !this.dontReportException(exception);
  }
}
