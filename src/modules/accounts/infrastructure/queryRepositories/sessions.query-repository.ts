import { InjectModel } from '@nestjs/mongoose';

import { Session, SessionModelType } from '../../domain/session.entity';

export class SessionsQueryRepository {
    constructor(
        @InjectModel(Session.name)
        private SessionModel: SessionModelType,
    ) {}

    async getAllSessionsDevices(userId: string): Promise<Session[]> {
        //TODO: return view model
        return this.SessionModel.find({ userId });
    }
}
