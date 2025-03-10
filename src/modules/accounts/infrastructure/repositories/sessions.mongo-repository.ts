// import { InjectModel } from '@nestjs/mongoose';
// import { Injectable } from '@nestjs/common';
// import { NotFoundDomainException } from '../../../../core/exceptions';
// import {
//     MongoSession,
//     MongoSessionDocument,
//     SessionModelType,
// } from '../../domain/session.entity';

// @Injectable()
// export class MongoSessionsRepository {
//     constructor(
//         @InjectModel(MongoSession.name) private SessionModel: SessionModelType,
//     ) {}

//     async save(session: MongoSessionDocument): Promise<MongoSessionDocument> {
//         return session.save();
//     }

//     async findByDeviceIdNonDeleted(
//         deviceId: string,
//     ): Promise<MongoSessionDocument | null> {
//         const session = await this.SessionModel.findOne({
//             deviceId,
//             deletedAt: null,
//         });

//         return session;
//     }

//     async findByDeviceIdNonDeletedOrNotFoundFail(
//         deviceId: string,
//     ): Promise<MongoSessionDocument> {
//         const session = await this.SessionModel.findOne({
//             deviceId,
//             deletedAt: null,
//         });

//         if (!session) {
//             throw NotFoundDomainException.create('MongoSession is not found');
//         }

//         return session;
//     }

//     async deleteAllSessionsExceptCurrent({
//         userId,
//         deviceId,
//     }: {
//         userId: string;
//         deviceId: string;
//     }): Promise<number> {
//         const result = await this.SessionModel.updateMany(
//             {
//                 userId,
//                 deviceId: { $ne: deviceId },
//             },
//             {
//                 deletedAt: new Date().toISOString(),
//             },
//         );

//         return result.modifiedCount;
//     }
// }
