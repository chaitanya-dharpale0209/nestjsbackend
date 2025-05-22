import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyInfoDto {
  @IsString()
  @IsNotEmpty()
  BusinessName: string;

  @IsString()
  @IsNotEmpty()
  GSTNumber: string;

  @IsString()
  @IsNotEmpty()
  CompanyPanCard: string;

  @IsString()
  ShopActLicence?: string;

  @IsString()
  WebsiteUrl?: string;
}