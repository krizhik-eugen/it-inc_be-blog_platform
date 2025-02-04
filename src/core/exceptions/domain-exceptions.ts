import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ErrorResponse } from '../dto/error.view-dto';

type TMessage = ErrorResponse['message'];
type TField = ErrorResponse['field'];

export class BadRequestDomainException extends BadRequestException {
    constructor(message: TMessage, field: TField = null) {
        super({ message, field });
    }
}

export class NotFoundDomainException extends NotFoundException {
    constructor(message: TMessage, field: TField = null) {
        super({ message, field });
    }
}

export class ForbiddenDomainException extends ForbiddenException {
    constructor(message: TMessage, field: TField = null) {
        super({ message, field });
    }
}

export class UnauthorizedDomainException extends UnauthorizedException {
    constructor(message: TMessage, field: TField = null) {
        super({ message, field });
    }
}
