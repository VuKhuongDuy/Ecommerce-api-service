import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slug from 'slug';
import { APP_CONFIG_NAME } from 'src/configs/app.config';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { Category, Product } from 'src/schema';
import { NotFoundDocumentException } from 'src/share/exceptions/not-found-docment.exception';
import { generateScreenshotCode } from 'src/share/utils/util';

export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private configService: ConfigService,
    private minioClientSvc: MinioClientService,
  ) {}

  get = async (query) => {
    const { q, limit, page, category_id } = query;
    const queryString = { delete_at: null } as any;

    //TODO filter
    // const result = await this.filter(query);

    if (page < 1) {
      throw new BadRequestException();
    }

    queryString['$or'] = [{ name: { $regex: `${q.trim()}`, $options: 'i' } }];

    if (category_id) {
      queryString.category_id = category_id;
    }

    const products = await this.productModel
      .find(queryString)
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ default_price: 1 })
      .exec();

    const total = await this.productModel.find(queryString).count().exec();

    return {
      total: total,
      data: this.enrichResponse(products),
    };
  };

  getByPrefix = async (prefix) => {
    let query = {};
    console.log({ prefix });
    switch (prefix) {
      case 'new':
        query = {
          new: true,
        };
        break;
      case 'best_seller':
        query = {
          best_seller: true,
        };
        break;
      case 'featured':
        query = {
          featured: true,
        };
        break;
      case 'flash_sale':
        query = {
          flash_sale: true,
        };
        break;
      case 'deal_of_the_day':
        query = {
          deal_of_the_day: true,
        };
        break;
      case 'carousel':
        query = {
          carousel: true,
        };
        break;
      default:
        query = {
          id: prefix,
        };
        break;
    }

    return this.productModel
      .find({
        ...query,
        delete_at: null,
      })
      .exec();
  };

  create = async (body) => {
    if (this.duplicateData(body)) {
    }

    //TODO slug
    const serializeData = await this.addSlug(body);

    const product = await this.productModel.insertMany(serializeData);
    if (!product) {
      throw new BadRequestException();
    }
    return product;
  };

  getPresignUrl(imageName) {
    if (!imageName) {
      throw new NotFoundDocumentException();
    }
    const { minio, jwt } = this.configService.get(`${APP_CONFIG_NAME}`);
    const minioObjectName = MinioClientService.createPathImage(
      generateScreenshotCode(imageName, jwt.secretkey),
    );
    return this.minioClientSvc.presignedPostPolicy(
      minio.bucket,
      minioObjectName,
    );
  }

  update = async (body) => {
    const product = await this.productModel.findById(body.id).exec();
    if (!product) {
      throw new BadRequestException();
    }
    const updateProduct = Object.assign(product, body);
    if (body.category_id && body.category_id != product.category_id) {
      body = this.addSlug(body);
    }
    return updateProduct.save();
  };

  delete = async (id) => {
    const product = await this.productModel.findById(id);
    product.delete_at = new Date();
    await product.save();
    return '';
  };

  // filter = async (query) => {
  //   const { category_id } = query;
  //   const queryFind = null;

  //   if (!category_id) {
  //     return [];
  //   }
  //   const category = await this.categoryModel.findById(category_id);
  //   if (!category) {
  //     return [];
  //   }
  //   const arr = Object.keys(query);
  //   arr.forEach(async (key) => {
  //     const index = category.filters.findIndex((m) => m.name == key);
  //     if (index >= 0) {
  //       const type = category.filters[index].type;
  //       if (type === 'number') {
  //         const valueFilter = (queryFind.filter[key] = {
  //           $gt: valueFilter[0],
  //           $lt: valueFilter[1],
  //         });
  //       }
  //     }

  //     queryFind.$where(
  //       `this.filter.${key} > ${valueFilter[0]} && this.filter.${key} < ${valueFilter[1]}`,
  //     );
  //     queryFind.$where(`this.filter.${key} === ${query[key]}`);
  //   });

  //   const result = await this.productModel.find(queryFind);
  //   return result;
  // };

  enrichResponse = async (products) => {
    return products;
    //TODO get discount
  };

  duplicateData = async (newProduct) => {
    const products = await this.productModel
      .find({
        $or: [{ name: newProduct.name }],
      })
      .exec();
    return products.length > 0;
  };

  addSlug = async (body) => {
    const { category_id } = body;
    const category = await this.categoryModel
      .findOne({ _id: category_id })
      .exec();

    if (category) {
      body.slug = category.slug + '/' + slug(body.name);
    } else {
      body.slug = slug(body.name);
    }

    return body;
  };
}
