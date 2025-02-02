import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';

export function appSetup(app: INestApplication) {
    globalPrefixSetup(app);
    pipesSetup(app);
    swaggerSetup(app);
    exceptionFilterSetup(app);
    app.enableCors();
}
