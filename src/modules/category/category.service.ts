import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  get = async (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.categoryModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.categoryModel.find({ id: id }).exec();
  };

  create = async (body) => {
    // TODO
    const category = await this.categoryModel.insertMany(body);
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  };

  update = () => {
    return null;
  };

  delete = () => {
    return null;
  };
}
