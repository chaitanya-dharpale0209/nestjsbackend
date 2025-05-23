import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class ContactDetailsDto {
  @IsString()
  @IsNotEmpty()
  PersonaName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @IsPhoneNumber() - You can uncomment this if you want strict phone validation
  PhoneNumber: string;

  role:string
}