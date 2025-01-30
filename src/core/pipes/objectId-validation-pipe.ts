// import { PipeTransform, Injectable } from '@nestjs/common';
// import { isValidObjectId } from 'mongoose';

// @Injectable()
// export class ObjectIdValidationPipe implements PipeTransform {
//     transform(value: string) {
//         if (!isValidObjectId(value)) {
//             // throw BadRequestDomainException.create(
//             //     `Invalid ObjectId format: ${value}`,
//             //     'userId',
//             // );
//             throw Error('not a valid object id'); //TODO: add exception handler
//         }

//         return value;
//     }
// }

//TODO: check this code to work in body validation
