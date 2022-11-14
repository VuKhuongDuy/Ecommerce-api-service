import { HttpException, HttpStatus } from '@nestjs/common'

export class NotChangeException extends HttpException {
  constructor(response: string | Record<string, any> = 'Not change') {
    super(response, HttpStatus.NOT_MODIFIED)
  }
}
