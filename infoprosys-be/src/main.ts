import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    app.enableCors({
    origin: '*', // or use '*' for any origin (less secure)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  const configService = app.get(ConfigService);
  const port = configService.get<number>('MONPORT') ?? 1000;
  await app.listen(port);
  console.log(`Running your Infoprosys backend on port ${port}`);
}
bootstrap();