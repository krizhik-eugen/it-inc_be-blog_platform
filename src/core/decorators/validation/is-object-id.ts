// import {
//     registerDecorator,
//     ValidationOptions,
//     ValidationArguments,
// } from 'class-validator';
// import { isValidObjectId } from 'mongoose';

// export function IsObjectId(validationOptions?: ValidationOptions) {
//     return function (object: object, propertyName: string) {
//         registerDecorator({
//             name: 'isObjectId',
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             validator: {
//                 validate(value: any) {
//                     return isValidObjectId(value);
//                 },
//                 defaultMessage(args: ValidationArguments) {
//                     return `${args.property} must be a valid ObjectId`;
//                 },
//             },
//         });
//     };
// }
