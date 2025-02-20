import { InjectModel } from '@nestjs/mongoose';

import { Session, SessionModelType } from '../../domain/session.entity';
import { SessionViewDto } from '../../api/dto/view-dto/sessions.view-dto';

export class SessionsQueryRepository {
    constructor(
        @InjectModel(Session.name)
        private SessionModel: SessionModelType,
    ) {}

    async getAllSessionsDevices(userId: string): Promise<SessionViewDto[]> {
        const sessions = await this.SessionModel.find({ userId });
        return sessions.map((session) => SessionViewDto.mapToView(session));
    }
}
