import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';

export class NewPasswordInputDto {
    @ApiProperty({
        maxLength: 20,
        minLength: 6,
        description: 'New password',
    })
    @IsString()
    @IsStringWithTrim(6, 20)
    newPassword: string;

    @ApiProperty({
        description: 'Code that has been sent with link via Email',
    })
    @IsStringWithTrim()
    recoveryCode: string;
}
