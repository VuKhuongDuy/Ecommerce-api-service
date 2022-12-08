import { MinioClientService } from 'src/minio-client/minio-client.service';

export class S3Service {
  constructor(private minioClientSvc: MinioClientService) {}

  get = () => {};
}
