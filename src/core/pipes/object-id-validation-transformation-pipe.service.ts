// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
// import { isValidObjectId, Types } from 'mongoose';
// import { BadRequestDomainException } from '../exceptions';

// @Injectable()
// export class ObjectIdValidationTransformationPipe implements PipeTransform {
//     transform(value: string, metadata: ArgumentMetadata): any {
//         if (metadata.metatype !== Types.ObjectId) {
//             return value;
//         }

//         if (!isValidObjectId(value)) {
//             throw BadRequestDomainException.create(
//                 `Invalid ObjectId: ${value}`,
//             );
//         }
//         return new Types.ObjectId(value);
//     }
// }

// /**
//  * Not add it globally. Use only locally
//  */
// @Injectable()
// export class ObjectIdValidationPipe implements PipeTransform {
//     transform(value: any): any {
//         if (!isValidObjectId(value)) {
//             throw BadRequestDomainException.create(
//                 `Invalid ObjectId: ${value}`,
//             );
//         }

//         return value;
//     }
// }
