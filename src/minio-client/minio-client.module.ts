import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { MongooseModule } from '@nestjs/mongoose';

const configMinio = {
  endPoint: process.env.MINIO_URL || 'stg-minio-tracking.zinza.com.vn',
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 80,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'console',
  secretKey: process.env.MINIO_SECRET_KEY || 'Zinza@2021',
  bucket: process.env.MINIO_BUCKET || 'tracking',
};

if (process.env.CI_BUILD_NAME == `check:e2e-test`) {
  configMinio.endPoint = 'minio';
  configMinio.port = 9000;
  configMinio.accessKey = 'console';
  configMinio.secretKey = 'Zinza@2021';
}
// console.log(configMinio)
@Module({
  imports: [
    // MinioModule.register(configMinio),
    // MinioModule.
    // MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    // LogQueryModule,
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
