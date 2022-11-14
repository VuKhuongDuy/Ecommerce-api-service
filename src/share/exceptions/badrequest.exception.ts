import { HttpException, HttpStatus } from '@nestjs/common'

export class BadRequestException extends HttpException {
  constructor(response: string | Record<string, any> = 'Bad request') {
    super(response, HttpStatus.BAD_REQUEST)
  }
}
