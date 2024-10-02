import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Category {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
  parent_id?: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
