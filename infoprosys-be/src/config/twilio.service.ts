// src/services/twilio.service.ts
import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly client: Twilio.Twilio;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendSmsOtp(phoneNumber: any, otp: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: `Your OTP for registration is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw new Error('Failed to send SMS OTP');
    }
  }
}