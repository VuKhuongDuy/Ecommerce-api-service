import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export const homeBanner = 'home-banner';
export const homeCenter = 'home-center';
export const homeSlide = 'home-slide';
export const productSidebarBanner = 'product-sidebar-left';

export type BannerDocument = HydratedDocument<Banner>;

@Schema({ collection: 'banners' })
export class Banner {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  redirect_url: string;

  @Prop()
  title: string;

  @Prop()
  title2: string;

  @Prop({ type: String })
  type: 'home-banner' | 'home-center' | 'home-slide' | 'product-sidebar-left';

  @Prop({ type: Date, required: true, default: Date.now })
  create_at: Date;

  @Prop({ type: Date })
  delete_at: Date;
}
export const BannerSchema = SchemaFactory.createForClass(Banner);

BannerSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
BannerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
