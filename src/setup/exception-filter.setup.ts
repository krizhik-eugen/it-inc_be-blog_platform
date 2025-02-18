import { INestApplication } from '@nestjs/common';
import {
    AllExceptionsFilter,
    DomainExceptionsFilter,
} from '../core/exceptions';
import { CoreConfig } from '../core/config';

export function exceptionFilterSetup(
    app: INestApplication,
    coreConfig: CoreConfig,
) {
    app.useGlobalFilters(
        new AllExceptionsFilter(coreConfig),
        new DomainExceptionsFilter(),
    );
}
