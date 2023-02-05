import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schema';
import { Discount } from 'src/schema/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(Product.name) private productModel: Model<Product>,

  ) { }

  get = async (query) => {
    const { q = '', limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    let discounts: any = await this.discountModel
      .find({ ...regex, delete_at: { $eq: "" } })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();

    let total = await this.discountModel
      .find({ ...regex, delete_at: { $eq: "" } }).count().exec();

    discounts = await Promise.all(discounts.map(async discount => {
      const listProductsID = discount.listproduct.map(product => product.id);
      const listProducts = await this.productModel.find({
        id: { $in: listProductsID }
      }).exec();

      discount.listproduct = discount.listproduct.map(p => {
        const product = listProducts.find(product => p.id === product.id);
        if (product) {
          return {
            ...p,
            name: product.name,
            description: product?.description,
            sku: product?.sku,
            thumb_image: product?.thumb_image?.[0]
          }
        }
      });
      return discount;
    }))
    return {
      total: total,
      data: discounts,
    }
  };

  getListProduct = async (id, query) => {
    const { page } = query;
    const PERPAGE = 10;
    if (page < 1) {
      throw new BadRequestException();
    }

    const discount = await this.discountModel
      .findById(id)
      .exec();

    const start = page * PERPAGE
    const end = (page + 1) * PERPAGE
    const listProductId = discount.listproduct.slice(start, end).map(product => product.id);

    return await this.productModel.find({
      id: { $in: listProductId }
    })
  }

  create = async (body) => {
    // TODO
    const discount = await this.discountModel.insertMany(body);
    if (!discount) {
      throw new BadRequestException();
    }
    return discount;
  };

  update = async (body) => {
    if (!body.id) {
      throw new BadRequestException();
    }
    let discount = await this.discountModel.findById(body.id);
    discount = Object.assign(discount, body);
    return discount.save();
  };

  delete = async (id) => {
    const discount = await this.discountModel.findById(id);
    discount.delete_at = new Date();
    await discount.save();
    return '';
  };
}
