import { PipeTransform, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
    transform(value: string) {
        if (!isValidObjectId(value)) {
            throw new BadRequestDomainException(
                `Invalid ObjectId format: ${value}`,
            );
        }

        return value;
    }
}
