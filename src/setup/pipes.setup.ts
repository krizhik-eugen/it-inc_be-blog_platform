import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '@nestjs/common';
import { BadRequestDomainException, ErrorExtension } from '../core/exceptions';

export const errorFormatter = (
    errors: ValidationError[],
    errorMessage?: any,
): ErrorExtension[] => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorsForResponse = errorMessage || [];

    for (const error of errors) {
        if (!error?.constraints && error?.children?.length) {
            errorFormatter(error.children, errorsForResponse);
        } else if (error?.constraints) {
            const constrainKeys = Object.keys(error.constraints);

            for (const key of constrainKeys) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                errorsForResponse.push({
                    message: error.constraints[key]
                        ? `${error.constraints[key]}; Received value: ${error?.value}`
                        : '',
                    key: error.property,
                });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
    app.useGlobalPipes(
        // new ObjectIdValidationTransformationPipe(),
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const formattedErrors = errorFormatter(errors);

                throw new BadRequestDomainException(formattedErrors);
            },
        }),
    );
}
