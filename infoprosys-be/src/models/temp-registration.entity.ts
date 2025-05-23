import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


// temp-registration.entity.ts
@Schema({ timestamps: true })
export class TempRegistration extends Document {
  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  phoneNumber?: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ required: true, index: { expires: '15m' } })
  expiresAt: Date;

  @Prop({ required: true, enum: ['email', 'sms'], default: 'email' })
  verificationMethod: string;
}

export const TempRegistrationSchema = SchemaFactory.createForClass(TempRegistration);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema({ timestamps: true })
// export class TempRegistration extends Document {
//   @Prop({
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     index: true,
//   })
//   email: string;

//   @Prop({ required: true })
//   otp: string;

//   @Prop({ default: false })
//   verified: boolean;

//   @Prop({ required: true, index: { expires: '15m' } })
//   expiresAt: Date;
// }

// export const TempRegistrationSchema = SchemaFactory.createForClass(TempRegistration);