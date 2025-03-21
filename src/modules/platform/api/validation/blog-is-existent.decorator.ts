import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PostgresBlogsRepository } from '../../infrastructure';

// Mandatory registration in ioc

// Attention! This approach should be used only in exceptional cases.
// This example is for testing purposes.
// Better to perform such checks in the BLL (Business Logic Layer).

@ValidatorConstraint({ name: 'BlogIsExistent', async: true })
@Injectable()
export class BlogIsExistentConstraint implements ValidatorConstraintInterface {
    constructor(
        // private mongoBlogsRepository: MongoBlogsRepository,
        private postgresBlogsRepository: PostgresBlogsRepository,
    ) {}
    async validate(value: number) {
        const foundBlog =
            await this.postgresBlogsRepository.findByIdNonDeleted(value);
        return Boolean(foundBlog);
    }

    defaultMessage(): string {
        return `PostgresBlog with provided Id does not exist`;
    }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function BlogIsExistent(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: BlogIsExistentConstraint,
        });
    };
}
