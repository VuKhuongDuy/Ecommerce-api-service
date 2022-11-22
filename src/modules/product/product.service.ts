import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APP_CONFIG_NAME } from 'src/configs/app.config';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Product } from 'src/schema';
import { NotFoundDocumentException } from 'src/share/exceptions/not-found-docment.exception';
import { generateScreenshotCode } from 'src/share/utils/util';

export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private configService: ConfigService,
    private minioClientSvc: MinioClientService,
  ) {}

  get = (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.productModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.productModel.findById(id);
  };

  create = async (body) => {
    const product = await this.productModel.insertMany(body);
    if (!product) {
      throw new BadRequestException();
    }
    return product;
  };

  getPresignUrl(user) {
    const { email } = user;
    if (email == null) {
      throw new NotFoundDocumentException();
    }
    const { minio, jwt } = this.configService.get(`${APP_CONFIG_NAME}`);
    const minioObjectName = MinioClientService.createPathImage(
      generateScreenshotCode(user._id, jwt.secretkey),
    );
    return this.minioClientSvc.presignedPostPolicy(
      minio.bucket,
      minioObjectName,
    );
  }

  update = (body) => {
    const product = this.productModel.findById(body.id);
    const newObject = Object.assign(product, body);
    return newObject.save();
  };

  delete = (id) => {
    return this.productModel.deleteOne({ id });
  };
}
