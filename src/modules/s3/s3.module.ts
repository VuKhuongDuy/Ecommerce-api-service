import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { AuthModule } from '../auth/auth.module';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service, AuthGuard],
  imports: [AuthModule, MinioClientModule],
  exports: [],
  controllers: [S3Controller],
})
export class S3Module {}
