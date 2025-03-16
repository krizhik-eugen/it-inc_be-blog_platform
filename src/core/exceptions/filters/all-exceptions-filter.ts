import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from './base-exception-filter';
import { CoreConfig } from '../../config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    constructor(private coreConfig: CoreConfig) {
        super();
    }

    onCatch(exception: unknown, response: Response, request: Request): void {
        console.log('exception', exception);

        const status: HttpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const isProduction = this.coreConfig.nodeEnv === 'production';

        if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
            response.status(status).json({
                ...this.getDefaultHttpBody(request.url, exception),
                path: null,
                message: 'Some error occurred',
            });

            return;
        }

        response
            .status(status)
            .json(this.getDefaultHttpBody(request.url, exception));
    }
}
