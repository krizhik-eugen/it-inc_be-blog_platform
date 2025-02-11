import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { CoreConfig } from '../core/config';

export function appSetup(app: INestApplication, coreConfig: CoreConfig) {
    globalPrefixSetup(app);
    pipesSetup(app);
    swaggerSetup(app, coreConfig);
    exceptionFilterSetup(app, coreConfig);
    app.enableCors();
}
