import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorsMessages {
    constructor(
        public message: string,
        public field: string | null = null,
    ) {}
}

export class DomainException extends Error {
    constructor(
        public message: string,
        public code: DomainExceptionCode,
        public errorsMessages: ErrorsMessages[],
    ) {
        super(message);
    }
}

function ConcreteDomainExceptionFactory(
    commonMessage: string,
    code: DomainExceptionCode,
) {
    return class extends DomainException {
        constructor(extensions: ErrorsMessages[]) {
            super(commonMessage, code, extensions);
        }

        static create(message?: string, field?: string) {
            return new this(
                message ? [new ErrorsMessages(message, field)] : [],
            );
        }
    };
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory(
    'Not Found',
    DomainExceptionCode.NotFound,
);
export const BadRequestDomainException = ConcreteDomainExceptionFactory(
    'Bad Request',
    DomainExceptionCode.BadRequest,
);
export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
    'Forbidden',
    DomainExceptionCode.Forbidden,
);
export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
    'Unauthorized',
    DomainExceptionCode.Unauthorized,
);
