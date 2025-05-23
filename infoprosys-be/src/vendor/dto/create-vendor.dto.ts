import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyInfoDto } from './company-info.dto';
import { ContactDetailsDto } from './contact-details.dto';
import { AddressDto } from './address.dto';

export class CreateVendorDto {
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  @IsNotEmpty()
  CompanyInfo: CompanyInfoDto;

  @ValidateNested()
  @Type(() => ContactDetailsDto)
  @IsNotEmpty()
  ContactDetails: ContactDetailsDto;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  Address: AddressDto;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  verified: string = "pending";

  role:string="vendor"
}