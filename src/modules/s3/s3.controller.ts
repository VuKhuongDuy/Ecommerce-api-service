import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get()
  async get(@Query() query) {
    return this.s3Service.get();
  }
}
