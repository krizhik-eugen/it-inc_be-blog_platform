import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsRepository } from '../../infrastructure';

// Mandatory registration in ioc

// Attention! This approach should be used only in exceptional cases.
// This example is for testing purposes.
// Better to perform such checks in the BLL (Business Logic Layer).

// TODO: remove this decorator and make a check in service
@ValidatorConstraint({ name: 'BlogIsExistent', async: true })
@Injectable()
export class BlogIsExistentConstraint implements ValidatorConstraintInterface {
    constructor(private blogsRepository: BlogsRepository) {}
    async validate(value: number) {
        const foundBlog = await this.blogsRepository.findByIdNonDeleted(value);
        return Boolean(foundBlog);
    }

    defaultMessage(): string {
        return `Blog with provided Id does not exist`;
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
