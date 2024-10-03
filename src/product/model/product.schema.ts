import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Product {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  sale: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: true })
  status: boolean;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category', default: null })
  category_id: Types.ObjectId;

  @Prop({ default: '' })
  image_id: string;

  @Prop({ default: '' })
  image_url: string;

  @Prop({ type: [Types.ObjectId], ref: 'ProductImage', default: [] })
  extra_images: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
