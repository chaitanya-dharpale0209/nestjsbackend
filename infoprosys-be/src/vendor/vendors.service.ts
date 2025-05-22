import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.entity';
import { TempRegistration } from '../models/temp-registration.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { StartRegistrationDto } from './dto/start-registration.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Express } from 'express';

@Injectable()
export class VendorsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TempRegistration.name) private tempRegModel: Model<TempRegistration>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async startRegistration(dto: StartRegistrationDto) {
    const { email } = dto;

    // Check if email exists
    const existingUser = await this.userModel.findOne({
      'ContactDetails.EmailAddress': email.toLowerCase(),
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create or update temp registration
    await this.tempRegModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        otp,
        expiresAt,
        verified: false,
      },
      { upsert: true, new: true },
    );

    // Send email
    try {
      const mailOptions = {
        from: `"Vendor Registration" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for Vendor Registration',
        text: `Your OTP for vendor registration is: ${otp}. This OTP is valid for 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">Vendor Registration OTP</h2>
            <p>Thank you for registering as a vendor. Please use the following OTP to verify your email address:</p>
            <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP is valid for 15 minutes and can be used only once.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        message: 'OTP sent to email',
        data: { email: email.toLowerCase() },
      };
    } catch (error) {
      throw new Error('Failed to send OTP email');
    }
  }

  async verifyOTP(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    // Find the temp registration
    const registrationData = await this.tempRegModel.findOne({
      email: email.toLowerCase(),
    });
    if (!registrationData) {
      throw new BadRequestException('Email not found or OTP expired');
    }

    // Check OTP
    if (registrationData.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check expiration
    if (new Date() > registrationData.expiresAt) {
      await this.tempRegModel.deleteOne({ email: email.toLowerCase() });
      throw new BadRequestException('OTP expired');
    }

    // Mark as verified
    registrationData.verified = true;
    await registrationData.save();

    return {
      success: true,
      message: 'OTP verified successfully',
      data: { email: email.toLowerCase() },
    };
  }

async completeRegistration(
  dto: CreateVendorDto,
  files: {
    GstCertificate?: Express.Multer.File[],
    PanCard?: Express.Multer.File[],
    ShopActLicence?: Express.Multer.File[],
    AdditionalDocument?: Express.Multer.File[],
  },
) {
  // Process files
  const documentsUpload = {
    GstCertificate: files.GstCertificate?.[0] ? {
      data: files.GstCertificate[0].buffer,
      contentType: files.GstCertificate[0].mimetype
    } : undefined,
    PanCard: files.PanCard?.[0] ? {
      data: files.PanCard[0].buffer,
      contentType: files.PanCard[0].mimetype
    } : undefined,
    ShopActLicence: files.ShopActLicence?.[0] ? {
      data: files.ShopActLicence[0].buffer,
      contentType: files.ShopActLicence[0].mimetype
    } : undefined,
    AdditionalDocument: files.AdditionalDocument?.[0] ? {
      data: files.AdditionalDocument[0].buffer,
      contentType: files.AdditionalDocument[0].mimetype
    } : undefined,
  };

  // Validate required documents
  if (!documentsUpload.GstCertificate || !documentsUpload.PanCard) {
    throw new BadRequestException('GST Certificate and PAN Card are required');
  }

  // Create user
  const newUser = new this.userModel({
    CompanyInfo: dto.CompanyInfo,
    ContactDetails: dto.ContactDetails,
    Address: dto.Address,
    DocumentsUpload: documentsUpload,
    password: await bcrypt.hash(dto.password, 12),
    emailVerified: true,
  });

  await newUser.save();

  const userResponse = newUser.toObject() as any;
  delete userResponse.password;

  return {
    success: true,
    message: 'Vendor registered successfully',
    data: userResponse,
  };
}

  async getVendor(id: string) {
    const vendor = await this.userModel.findById(id).select('-password').exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return {
      success: true,
      data: vendor,
    };
  }
}