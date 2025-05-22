import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  StreetAddress: string;

  @IsString()
  @IsNotEmpty()
  City: string;

  @IsString()
  @IsNotEmpty()
  State: string;

  @IsString()
  @IsNotEmpty()
  PostalCode: string;

  @IsString()
  Country?: string = 'India';
}