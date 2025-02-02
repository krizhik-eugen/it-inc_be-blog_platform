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

        //TODO: consider environment to send or not send mongo error
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (exception.name === 'MongoServerError') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            defaultError.message = `${exception.name}, code: ${exception.code},`;
        }

        if (exception instanceof HttpException) {
            errorStatusCode = exception.getStatus();

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

            response.status(errorStatusCode).json(httpErrorResponse);
        }
    }
}
