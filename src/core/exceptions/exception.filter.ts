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
    field: string | null;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<HttpErrorResponse>>();
        let errorStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let httpErrorResponse: HttpErrorResponse = this.createErrorResponse(
            'Unknown error occurred',
        );

        if (this.isMongoError(exception)) {
            httpErrorResponse = this.createErrorResponse(
                this.getMongoErrorMessage(exception),
            );
        } else if (exception instanceof HttpException) {
            errorStatusCode = exception.getStatus();
            httpErrorResponse = this.handleHttpException(
                exception,
                errorStatusCode,
            );
        }

        response.status(errorStatusCode).json(httpErrorResponse);
    }

    private isMongoError(
        exception: unknown,
    ): exception is Error & { code: number } {
        return (
            process.env.NODE_ENV === 'development' &&
            exception instanceof Error &&
            exception.name === 'MongoServerError' &&
            'code' in exception
        );
    }

    private getMongoErrorMessage(exception: Error & { code: number }): string {
        return `${exception.name}, code: ${exception.code}`;
    }

    private handleHttpException(
        exception: HttpException,
        statusCode: HttpStatus,
    ): HttpErrorResponse {
        const exceptionResponse = exception.getResponse() as ExceptionResponse;

        if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
            return this.createErrorResponse(
                'Too many requests, please try again later.',
            );
        }

        if (typeof exceptionResponse.message === 'string') {
            return this.createErrorResponse(
                exceptionResponse.message,
                exceptionResponse.field,
            );
        }

        if (Array.isArray(exceptionResponse.message)) {
            return { errorsMessages: exceptionResponse.message };
        }

        return this.createErrorResponse('Unknown error occurred');
    }

    private createErrorResponse(
        message: string,
        field: string | null = null,
    ): HttpErrorResponse {
        return { errorsMessages: [{ field, message }] };
    }
}
