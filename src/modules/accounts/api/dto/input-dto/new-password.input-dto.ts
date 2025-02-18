import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation';
import { userPasswordConstraints } from '../../../domain/user.entity';

export class NewPasswordInputDto {
    @ApiProperty({
        maxLength: userPasswordConstraints.maxLength,
        minLength: userPasswordConstraints.minLength,
        description: 'New password',
    })
    @IsString()
    @IsStringWithTrim(
        userPasswordConstraints.minLength,
        userPasswordConstraints.maxLength,
    )
    newPassword: string;

    @ApiProperty({
        description: 'Code that has been sent with link via Email',
    })
    @IsStringWithTrim()
    recoveryCode: string;
}
