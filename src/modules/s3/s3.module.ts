import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service, AuthGuard],
  imports: [],
  exports: [],
  controllers: [S3Controller],
})
export class S3Module {}
