import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse, HttpErrorResponse } from '../dto/error.view-dto';

type ExceptionResponse = {
    message: string | ErrorResponse[];
    field?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<HttpErrorResponse>>();
        let errorStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        const defaultError: ErrorResponse = {
            field: null,
            message: 'Unknown error occurred',
        };

        const httpErrorResponse: HttpErrorResponse = {
            errorsMessages: [defaultError],
        };

        // Show Mongo error only in development
        const isDevEnvironment = process.env.NODE_ENV === 'development';
        if (
            isDevEnvironment &&
            exception instanceof Error &&
            exception.name === 'MongoServerError' &&
            'code' in exception
        ) {
            defaultError.message = `${exception.name}, code: ${exception.code as string},`;
        }

        if (exception instanceof HttpException) {
            errorStatusCode = exception.getStatus();

            if (errorStatusCode === HttpStatus.TOO_MANY_REQUESTS) {
                defaultError.message = 'Too many requests';
            }

            const exceptionResponse =
                exception.getResponse() as ExceptionResponse;

            if (typeof exceptionResponse.message === 'string') {
                defaultError.message = exceptionResponse.message;
                if (exceptionResponse.field) {
                    defaultError.field = exceptionResponse.field;
                }
            } else if (Array.isArray(exceptionResponse.message)) {
                httpErrorResponse.errorsMessages = exceptionResponse.message;
            }
        }
        response.status(errorStatusCode).json(httpErrorResponse);
    }
}
