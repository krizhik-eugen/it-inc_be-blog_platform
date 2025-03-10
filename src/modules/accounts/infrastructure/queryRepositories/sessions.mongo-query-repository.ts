// import { InjectModel } from '@nestjs/mongoose';
// import { MongoSession, SessionModelType } from '../../domain/session.entity';
// import { MongoSessionViewDto } from '../../api/dto/view-dto';

// export class MongoSessionsQueryRepository {
//     constructor(
//         @InjectModel(MongoSession.name)
//         private SessionModel: SessionModelType,
//     ) {}

//     async getAllSessionsDevices(
//         userId: string,
//     ): Promise<MongoSessionViewDto[]> {
//         const sessions = await this.SessionModel.find({
//             userId,
//             deletedAt: null,
//         });
//         return sessions.map((session) =>
//             MongoSessionViewDto.mapToView(session),
//         );
//     }
// }
