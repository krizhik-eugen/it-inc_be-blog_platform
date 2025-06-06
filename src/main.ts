import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup';
import { initAppModule } from './init-app-module';
import { CoreConfig } from './core/config';

async function bootstrap() {
    const DynamicAppModule = await initAppModule();
    const app = await NestFactory.create(DynamicAppModule);

    const coreConfig = app.get<CoreConfig>(CoreConfig);

    appSetup(app, coreConfig, DynamicAppModule);

    const port = coreConfig.port;

    await app.listen(port, () => {
        console.log('App starting listen port: ', port);
        console.log('NODE_ENV: ', coreConfig.nodeEnv);
    });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
