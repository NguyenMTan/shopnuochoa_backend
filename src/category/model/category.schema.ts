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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category', default: null })
  parent_id?: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Category', required: false })
  children?: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
