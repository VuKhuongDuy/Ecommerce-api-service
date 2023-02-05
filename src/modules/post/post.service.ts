import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import * as slug from 'slug';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

  get = async (query) => {
    const { q = '', limit = 10, page = 1 } = query;
    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    const post = await this.postModel
      .find({ delete_at: null, ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();

    const total = await this.postModel.find({ delete_at: null, ...regex }).count().exec();

    return {
      total: total,
      data: post,
    }
  };

  getById = (id) => {
    return this.postModel.find({ id: id }).exec();
  };

  create = async (body) => {
    body.slug = slug(body.title);
    const post = await this.postModel.insertMany(body);
    if (!post) {
      throw new BadRequestException();
    }
    return post;
  };

  update = async (body) => {
    const post = await this.postModel.findById(body.id).exec();
    if (!post) {
      throw new BadRequestException();
    }

    delete body.id;
    const newPost = Object.assign(post, body);
    newPost.slug = slug(newPost.title);
    return newPost.save();
  };

  delete = async (id) => {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new BadRequestException();
    }

    post.delete_at = new Date();
    await post.save();
    return;
  };
}
