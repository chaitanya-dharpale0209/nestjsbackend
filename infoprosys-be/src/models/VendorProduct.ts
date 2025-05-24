import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorProductDocument = VendorProduct & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class VendorProduct {
  @Prop({ required: true })
  productName: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop()
  brand: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: [String] })
  imagesArray: string[];

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: [String] })
  tagsArray: string[];

  @Prop()
  updatedAt: Date;
}

export const VendorProductSchema = SchemaFactory.createForClass(VendorProduct);
