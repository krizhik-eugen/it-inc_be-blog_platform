import { DynamicModule, INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { CoreConfig } from '../core/config';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { validationConstraintSetup } from './validation-constraint.setup';

export function appSetup(
    app: INestApplication,
    coreConfig: CoreConfig,
    DynamicAppModule: DynamicModule,
) {
    globalPrefixSetup(app);
    pipesSetup(app);
    swaggerSetup(app, coreConfig);
    validationConstraintSetup(app, DynamicAppModule);
    exceptionFilterSetup(app, coreConfig);
    app.enableCors();
    app.use(cookieParser());
    (app as NestExpressApplication).enable('trust proxy');
}
