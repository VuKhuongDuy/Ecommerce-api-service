import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

class Filter {
  name: string;
  values: [string];
  type: string;
}

@Schema({ collection: 'categories' })
export class Category {
  @Prop({ alias: 'id', type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  filters: [Filter];

  @Prop()
  image: string;

  /**
    filter: {
      price: {
        default: [2000,4000],
        type: number
      },
      originL {
        default: ['usa', 'ja', 'vier nam'],
        type: string
      },
    }
   */

  @Prop({ type: Date, required: true, default: Date.now })
  create_at: Date;

  @Prop({ type: Date })
  delete_at: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

// CategorySchema.virtual('id').get(function () {
//   return this._id;
// });

// // Ensure virtual fields are serialised.
// CategorySchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     // delete ret._id;
//   },
// });
