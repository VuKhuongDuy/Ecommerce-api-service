import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  get = async (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.orderModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.orderModel.find({ id: id }).exec();
  };

  create = async (body) => {
    // TODO
    const order = await this.orderModel.insertMany(body);
    if (!order) {
      throw new BadRequestException();
    }
    return order;
  };

  update = () => {
    return null;
  };

  delete = () => {
    return null;
  };
}
