import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
    /**
     * Create the application context first, as the dynamic AppModule requires additional configuration before app creation.
     */
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const coreConfig = appContext.get<CoreConfig>(CoreConfig);
    const DynamicAppModule = await AppModule.forRoot(coreConfig);
    const app = await NestFactory.create(DynamicAppModule);

    await appContext.close();
    const port = coreConfig.port;

    appSetup(app, coreConfig);

    await app.listen(port);

    console.log(`Server is running on port ${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
