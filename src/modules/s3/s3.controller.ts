import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiSuccessResponse } from 'src/share/api-response';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get('/presign')
  async get(@Query() query, @Res() res) {
    return res.send(ApiSuccessResponse.create(await this.s3Service.get(query)));
  }
}
