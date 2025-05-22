import { IsEmail, IsNotEmpty } from 'class-validator';
import { ContactDetails } from 'src/models/contact-details.entity';
import { DocumentsUpload } from 'src/models/documents-upload.entity';

export class StartRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  //
  
  DocumentsUpload : DocumentsUpload;
}