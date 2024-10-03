import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class ProductImage {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ default: '' })
  image_id: string;

  @Prop({ default: '' })
  image_url: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
