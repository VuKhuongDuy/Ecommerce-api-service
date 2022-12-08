import { HttpException, HttpStatus } from '@nestjs/common';

export class UnknownError extends HttpException {
  constructor(message) {
    super(message, HttpStatus.NOT_IMPLEMENTED);
  }
}
