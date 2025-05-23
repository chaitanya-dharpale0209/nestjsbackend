import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { User, UserSchema } from '../models/user.entity';
import { TempRegistration, TempRegistrationSchema } from '../models/temp-registration.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TwilioModule } from 'src/Modules/Twilio/twilio.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TempRegistration.name, schema: TempRegistrationSchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    TwilioModule
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}