import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount } from 'src/schema/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
  ) {}

  get = async (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.discountModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.discountModel.find({ id: id }).exec();
  };

  create = async (body) => {
    // TODO
    const discount = await this.discountModel.insertMany(body);
    if (!discount) {
      throw new BadRequestException();
    }
    return discount;
  };

  update = () => {
    return null;
  };

  delete = () => {
    return null;
  };
}
