import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { redisStore } from './redis/redisStore';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH || '')),
    cert: fs.readFileSync(
      path.join(__dirname, process.env.SSL_CERT_PATH || ''),
    ),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'secret123',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      },
    }),
  );
  app.use(cookieParser());

  await app.listen(5000);
}
bootstrap();
