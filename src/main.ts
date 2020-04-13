import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';

config(); // TODO : move it to config service

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule);

    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            skipMissingProperties: true,
        })
    );

    SwaggerModule.setup(
        'api',
        app,
        SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Flip API').setVersion('0.1').build())
    );

    await app.listen(parseInt(process.env.PORT));
}

bootstrap();
