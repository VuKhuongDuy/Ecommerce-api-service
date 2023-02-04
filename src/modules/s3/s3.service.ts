import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class S3Service {
  constructor(private minioClientSvc: MinioClientService) {}

  get = async (query) => {
    const { imageName } = query;

    if (!imageName) {
      throw new BadRequestException();
    }
    const result = await this.minioClientSvc.presignGetObject(
      'ecommerce',
      `product/${imageName}`,
    );
    return result;
  };
}
