import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const port = process.env.PORT ?? 3000; //TODO: move to app config
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(port);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
