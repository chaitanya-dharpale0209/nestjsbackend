import { Module } from "@nestjs/common";
import { TwilioService } from "src/config/twilio.service";

// twilio.module.ts
@Module({
  providers: [TwilioService],
  exports: [TwilioService], // 👈 Required to make it available to other modules
})
export class TwilioModule {}
