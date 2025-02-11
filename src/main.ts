import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
    // const dynamicAppModule = await initAppModule();
    // // Create our Application based on the configured module
    // const app = await NestFactory.create(dynamicAppModule);

    // const coreConfig = app.get<CoreConfig>(CoreConfig);

    // // Setup the application
    // appSetup(app, coreConfig);

    // // Start the server
    // await app.listen(coreConfig.PORT);

    const app = await NestFactory.create(AppModule);

    // const appConfig = app.get<CoreConfig>('CoreConfig');
    // const port = appConfig.port;

    appSetup(app);

    await app.listen(3001);

    console.log(`Server is running on port ${3001}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
