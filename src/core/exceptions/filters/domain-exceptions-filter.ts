import { Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from './base-exception-filter';
import { DomainException } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

export class ErrorResponse {
    message: string;
    field: string | null;
}

export type HttpErrorBody = {
    errorsMessages: ErrorResponse[];
};

@Catch(DomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
    onCatch(exception: DomainException, response: Response): void {
        response
            .status(this.calculateHttpCode(exception))
            .json(this.getHttpErrorBody(exception));
    }

    calculateHttpCode(exception: DomainException) {
        switch (exception.code) {
            case DomainExceptionCode.BadRequest: {
                return HttpStatus.BAD_REQUEST;
            }
            case DomainExceptionCode.Forbidden: {
                return HttpStatus.FORBIDDEN;
            }
            case DomainExceptionCode.NotFound: {
                return HttpStatus.NOT_FOUND;
            }
            case DomainExceptionCode.Unauthorized: {
                return HttpStatus.UNAUTHORIZED;
            }
            default: {
                return HttpStatus.I_AM_A_TEAPOT;
            }
        }
    }

    getHttpErrorBody(exception: unknown): HttpErrorBody {
        const errorsMessages =
            exception instanceof DomainException ? exception.extensions : [];
        const mappedErrorsMessages = errorsMessages.map((error) => ({
            message: error.message,
            field: error.key,
        }));

        return {
            errorsMessages: mappedErrorsMessages,
        };
    }
}
