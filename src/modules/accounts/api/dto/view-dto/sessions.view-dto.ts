import { ApiProperty } from '@nestjs/swagger';
import { PostgresSession } from '../../../domain/session.postgres-entity';

// export class MongoSessionViewDto {
//     @ApiProperty()
//     ip: string;
//     @ApiProperty()
//     title: string;
//     @ApiProperty()
//     lastActiveDate: string;
//     @ApiProperty()
//     deviceId: string;

//     static mapToView(session: MongoSessionDocument): MongoSessionViewDto {
//         const dto = new MongoSessionViewDto();

//         dto.ip = session.ip;
//         dto.title = session.deviceName;
//         dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
//         dto.deviceId = session.deviceId;

//         return dto;
//     }
// }

export class PostgresSessionViewDto {
    @ApiProperty()
    ip: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    lastActiveDate: string;
    @ApiProperty()
    deviceId: string;

    static mapToView(session: PostgresSession): PostgresSessionViewDto {
        const dto = new PostgresSessionViewDto();

        dto.ip = session.ip;
        dto.title = session.device_name;
        dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
        dto.deviceId = session.device_id;

        return dto;
    }
}
