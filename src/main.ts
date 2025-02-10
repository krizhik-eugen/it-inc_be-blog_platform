import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
    const port = process.env.PORT ?? 3003; //TODO: move to app config

    const app = await NestFactory.create(AppModule);

    appSetup(app);

    await app.listen(port);

    console.log(`Server is running on port ${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
