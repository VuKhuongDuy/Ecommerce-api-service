import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongStatusException extends HttpException {
  constructor(message) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
