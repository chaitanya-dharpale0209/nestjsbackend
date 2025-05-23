import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsModule } from './vendor/vendors.module';
import { ExecModules } from './Modules/exec.modules';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UsersModule } from './Modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TwilioModule } from './Modules/Twilio/twilio.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://kalyanmagar789:12345@cluster0.zibrs.mongodb.net/ATPL'),
      ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 60 seconds in milliseconds
          limit: 5,
        },
      ],
    }),
    
    VendorsModule,
    ExecModules,
     UsersModule,
    AuthModule,
    TwilioModule,
  ],
})
export class AppModule {}
// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
