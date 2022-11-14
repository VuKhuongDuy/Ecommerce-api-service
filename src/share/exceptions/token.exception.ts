import { HttpException, HttpStatus } from '@nestjs/common'

export class TokenException extends HttpException {
  constructor(message = 'Invalid token') {
    super(message, HttpStatus.FORBIDDEN)
  }
}
