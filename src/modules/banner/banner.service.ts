import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slug from 'slug';
import { Banner, homeBanner1, homeBanner2, homeSlide, productSidebarBanner } from 'src/schema/banner.schema';

@Injectable()
export class BannerService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<Banner>) {}

  get = async () => {
    return this.bannerModel.find({ delete_at: null }).exec();
  };

  getSpecific = async (bannerType) => {
    let banners = [];
    switch (bannerType) {
      case 'homeBanner1':
        banners = await this.bannerModel
          .find({ type: homeBanner1, delete_at: null })
          .exec();
        break;
      case 'homeBanner2':
        banners = await this.bannerModel
          .find({ type: homeBanner2, delete_at: null })
          .exec();
        break;
      case 'homeSlide':
        banners = await this.bannerModel
          .find({ type: homeSlide, delete_at: null })
          .exec();
        break;
      case 'productSidebarBanner':
        banners = await this.bannerModel
          .find({ type: productSidebarBanner, delete_at: null })
          .exec();
        break;
      default:
        break;
    }

    return banners;
  };

  create = async (body) => {
    console.log({ body });
    if (!body.name) {
      throw new BadRequestException();
    }

    body.slug = slug(body.name);
    const banner = await this.bannerModel.insertMany(body);
    if (!banner) {
      throw new BadRequestException();
    }
    return banner;
  };

  update = async (body) => {
    const banner = await this.bannerModel.findById(body.id);
    if (!banner) {
      throw new BadRequestException();
    }

    delete body.id;
    const newCate = Object.assign(banner, body);
    return newCate.save();
  };

  delete = async (id) => {
    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new BadRequestException();
    banner.delete_at = new Date();
    await banner.save();
    return;
  };
}
