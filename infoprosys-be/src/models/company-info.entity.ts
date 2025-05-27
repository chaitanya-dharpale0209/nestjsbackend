import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class CompanyInfo extends Document {
  @Prop({ required: true, trim: true })
  BusinessName: string;

  @Prop({ required: false, trim: true, uppercase: true, unique:true })
  GSTNumber: string;

  @Prop({ required: true, trim: true, uppercase: true })
  CompanyPanCard: string;

  @Prop({ trim: true })
  ShopActLicence: string;

  @Prop({ trim: true })
  WebsiteUrl: string;
}

export const CompanyInfoSchema = SchemaFactory.createForClass(CompanyInfo);