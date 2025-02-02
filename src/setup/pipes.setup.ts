import {
    BadRequestException,
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
interface ErrorResponse {
    field: string;
    message: string;
}

const errorsFormatter = (errors: ValidationError[]) => {
    const errorsForResponse: ErrorResponse[] = [];
    for (const error of errors) {
        if (error.constraints) {
            const constrainKeys = Object.keys(error.constraints);
            for (const key of constrainKeys) {
                errorsForResponse.push({
                    field: error.property,
                    message: error.constraints[key],
                });
            }
        }
    }

    return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errorsFormatter(errors);
                if (formattedErrors.length) {
                    throw new BadRequestException(formattedErrors);
                }
            },
        }),
    );
}
