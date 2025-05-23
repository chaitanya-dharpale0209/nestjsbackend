import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ContactDetails } from 'src/models/contact-details.entity';
import { DocumentsUpload } from 'src/models/documents-upload.entity';

// start-registration.dto.ts
export class StartRegistrationDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber() // Validate phone number format
  phoneNumber?: string;
}

// verify-otp.dto.ts
export class VerifyOtpDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

// import { IsEmail, IsNotEmpty } from 'class-validator';
// import { ContactDetails } from 'src/models/contact-details.entity';
// import { DocumentsUpload } from 'src/models/documents-upload.entity';

// export class StartRegistrationDto {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   //
  
//   DocumentsUpload : DocumentsUpload;
// }