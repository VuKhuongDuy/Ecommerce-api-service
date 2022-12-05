import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';

const configMinio = {
  endPoint: process.env.MINIO_URL || 'localhost',
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 80,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'console',
  secretKey: process.env.MINIO_SECRET_KEY || 'secret',
  bucket: process.env.MINIO_BUCKET || 'ecommerce',
};

@Module({
  imports: [MinioModule.register(configMinio)],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
