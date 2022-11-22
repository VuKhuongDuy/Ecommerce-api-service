import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  get = async (query) => {
    const { q, limit, page } = query;

    if (page < 1) {
      throw new BadRequestException();
    }

    const regex = {
      $or: [{ name: { $regex: `${q.trim()}`, $options: 'i' } }],
    };

    return this.postModel
      .find({ ...regex })
      .limit(limit)
      .skip((page - 1) * 10)
      .sort({ create_at: 1 })
      .exec();
  };

  getById = (id) => {
    return this.postModel.find({ id: id }).exec();
  };

  create = async (body) => {
    // TODO
    const post = await this.postModel.insertMany(body);
    if (!post) {
      throw new BadRequestException();
    }
    return post;
  };

  update = () => {
    return null;
  };

  delete = () => {
    return null;
  };
}
