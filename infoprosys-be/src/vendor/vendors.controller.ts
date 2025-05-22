import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VendorsService } from './vendors.service';
import { StartRegistrationDto } from './dto/start-registration.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('start-registration')
  async startRegistration(@Body() dto: StartRegistrationDto) {
    return this.vendorsService.startRegistration(dto);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.vendorsService.verifyOTP(dto);
  }

 @Post('complete-registration')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'GstCertificate', maxCount: 1 },
    { name: 'PanCard', maxCount: 1 },
    { name: 'ShopActLicence', maxCount: 1 },
    { name: 'AdditionalDocument', maxCount: 1 },
  ])
)
async completeRegistration(
  @Body() dto: CreateVendorDto,
  @UploadedFiles() files: {
    GstCertificate?: Express.Multer.File[],
    PanCard?: Express.Multer.File[],
    ShopActLicence?: Express.Multer.File[],
    AdditionalDocument?: Express.Multer.File[],
  },
) {
  // Parse the nested objects from strings to objects
  const parsedDto = {
    ...dto,
    CompanyInfo: typeof dto.CompanyInfo === 'string' ? JSON.parse(dto.CompanyInfo) : dto.CompanyInfo,
    ContactDetails: typeof dto.ContactDetails === 'string' ? JSON.parse(dto.ContactDetails) : dto.ContactDetails,
    Address: typeof dto.Address === 'string' ? JSON.parse(dto.Address) : dto.Address,
  };

  return this.vendorsService.completeRegistration(parsedDto, files);
}
}