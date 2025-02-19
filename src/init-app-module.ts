import { NestFactory } from '@nestjs/core';
import { DynamicModule } from '@nestjs/common';
import { AppModule } from './app.module';
import { CoreConfig } from './core/config';

export async function initAppModule(): Promise<DynamicModule> {
    /**
     * Create the application context first, as the dynamic AppModule requires additional configuration before app creation.
     */
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const coreConfig = appContext.get<CoreConfig>(CoreConfig);
    await appContext.close();

    return AppModule.forRoot(coreConfig);
}
