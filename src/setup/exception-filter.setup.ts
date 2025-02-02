import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../core/exceptions/exception.filter';

export function exceptionFilterSetup(app: INestApplication) {
    app.useGlobalFilters(new HttpExceptionFilter());
}
