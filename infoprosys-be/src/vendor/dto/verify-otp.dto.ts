import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;
  
  @IsNotEmpty()
  otp: string;
}