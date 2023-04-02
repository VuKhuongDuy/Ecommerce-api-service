import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slug from 'slug';
import { Category, Product } from 'src/schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  get = async (query) => {
    const { q = '', limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      delete_at: null,
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    const data = await this.categoryModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();

    const count = await this.categoryModel.find({ ...regex }).count();

    return {
      data,
      count,
    };
  };

  getBySlug = async (slug) => {
    return this.categoryModel.find({ slug: slug });
  };

  // getProductByCategory = async (slug) => {
  //   const category = await this.categoryModel
  //     .findOne({
  //       slug: slug,
  //     })
  //     .exec();

  //   const products = await this.productModel.find({
  //     category: category.id,
  //   });

  //   return products;
  // };

  create = async (body) => {
    // TODO
    if (!body.name) {
      throw new BadRequestException();
    }

    body.slug = slug(body.name);
    const category = await this.categoryModel.insertMany(body);
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  };

  update = async (body) => {
    const category = await this.categoryModel.findById(body.id);
    if (!category) {
      throw new BadRequestException();
    }

    delete body.id;
    const newCate = Object.assign(category, body);
    newCate.slug = slug(newCate.name);

    //TODO update slug of all product
    return newCate.save();
  };

  delete = async (id) => {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new BadRequestException();
    category.delete_at = new Date();
    await category.save();
    return;
  };
}
