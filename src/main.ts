import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.rawBody = buf.toString();
    }
  }))

  app.enableCors({
    origin: 'http://localhost:5173', // FE origin
    methods: ['GET', 'POST'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
