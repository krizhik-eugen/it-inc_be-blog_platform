import { DynamicModule, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';

/**
 * For dependency injection in validator constraint decorators
 * @param app
 * @param DynamicAppModule
 */
export const validationConstraintSetup = (
    app: INestApplication,
    DynamicAppModule: DynamicModule,
) => {
    // {fallbackOnErrors: true} is required because Nest generates an exception
    // when DI doesn't have the necessary class.
    const appContext = app.select(DynamicAppModule);

    useContainer(appContext, {
        fallbackOnErrors: true,
    });
};
