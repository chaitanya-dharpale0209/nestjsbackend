import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ContactDetails extends Document {
  @Prop({ required: true, trim: true })
  PersonaName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  EmailAddress: string;

  @Prop({ required: true, trim: true })
  PhoneNumber: string;
}

export const ContactDetailsSchema = SchemaFactory.createForClass(ContactDetails);