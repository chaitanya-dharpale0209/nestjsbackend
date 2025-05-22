import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class DocumentsUpload extends Document {
  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  GstCertificate: {
    data: Buffer;
    contentType: string;
  };

  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  PanCard: {
    data: Buffer;
    contentType: string;
  };

  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  ShopActLicence: {
    data: Buffer;
    contentType: string;
  };

  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  AdditionalDocument: {
    data: Buffer;
    contentType: string;
  };
}

export const DocumentsUploadSchema = SchemaFactory.createForClass(DocumentsUpload);