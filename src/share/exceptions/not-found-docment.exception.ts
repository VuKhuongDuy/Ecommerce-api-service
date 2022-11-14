import { HttpException, HttpStatus } from '@nestjs/common'

export class NotFoundDocumentException extends HttpException {
  constructor(response: string | Record<string, any> = 'Not Found') {
    super(response, HttpStatus.NOT_FOUND)
  }
}
