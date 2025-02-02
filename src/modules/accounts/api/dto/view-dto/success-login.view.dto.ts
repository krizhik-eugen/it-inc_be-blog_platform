import { ApiProperty } from '@nestjs/swagger';

export class SuccessLoginViewDto {
    @ApiProperty({ description: 'JWT access token' })
    accessToken: string;
}
