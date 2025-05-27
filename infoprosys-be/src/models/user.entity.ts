import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CompanyInfo, CompanyInfoSchema } from './company-info.entity';
import { ContactDetails, ContactDetailsSchema } from './contact-details.entity';
import { Address, AddressSchema } from './address.entity';
import { DocumentsUpload, DocumentsUploadSchema } from './documents-upload.entity';

export enum Role {
  SuperAdmin = 'super_admin',
  Vendor = 'vendor',
}

export enum Status {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}

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

  @Prop({ default: "pending" })
  verified: string = "pending";

  @Prop({ required: false, enum: Role })
  role: Role;

  @Prop({required:false,})
  email:string;

  @Prop({ enum: Status, default: Status.Pending })
  status: Status;

  @Prop()
  refreshToken?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'VendorProduct' }] })
  products: Types.ObjectId[];
}

export type UserDocument = User & Document & {
  _id: Types.ObjectId;
};

export const UserSchema = SchemaFactory.createForClass(User);

// Add pre-save hook
UserSchema.pre('save', function (next) {
  this['updatedAt'] = new Date();
  next();
});

