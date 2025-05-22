import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CompanyInfo, CompanyInfoSchema } from './company-info.entity';
import { ContactDetails, ContactDetailsSchema } from './contact-details.entity';
import { Address, AddressSchema } from './address.entity';
import { DocumentsUpload, DocumentsUploadSchema } from './documents-upload.entity';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: CompanyInfoSchema, required: true })
  CompanyInfo: CompanyInfo;

  @Prop({ type: ContactDetailsSchema, required: true })
  ContactDetails: ContactDetails;

  @Prop({ type: AddressSchema, required: true })
  Address: Address;

  @Prop({ type: DocumentsUploadSchema, required: true })
  DocumentsUpload: DocumentsUpload;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add pre-save hook
UserSchema.pre('save', function (next) {
  this['updatedAt'] = new Date();
  next();
});