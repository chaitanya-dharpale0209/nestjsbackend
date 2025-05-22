import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Address extends Document {
  @Prop({ required: true, trim: true })
  StreetAddress: string;

  @Prop({ required: true, trim: true })
  City: string;

  @Prop({ required: true, trim: true })
  State: string;

  @Prop({ required: true, trim: true })
  PostalCode: string;

  @Prop({ required: true, trim: true, default: 'India' })
  Country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);