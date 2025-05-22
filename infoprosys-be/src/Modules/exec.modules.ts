import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.entity';
import { TempRegistration, TempRegistrationSchema } from '../models/temp-registration.entity';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ExecController } from 'src/Controllers/ExeController';
import { VendorsService } from 'src/vendor/vendors.service';
import { execService } from 'src/Services/ExecService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TempRegistration.name, schema: TempRegistrationSchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [ExecController],
  providers: [execService],
})
export class ExecModules {}