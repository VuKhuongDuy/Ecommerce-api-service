import { HttpException, HttpStatus } from '@nestjs/common';

export class UnAuthorizedException extends HttpException {
  constructor(response: string | Record<string, any> = 'Unauthorized') {
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
