import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation';
import { userEmailConstraints } from '../../../domain/user.entity';

export class PasswordRecoveryInputDto {
    @ApiProperty({
        pattern: String(userEmailConstraints.pattern),
        example: 'john@example.com',
        description: 'Email of registered user',
    })
    @IsEmail()
    @Matches(userEmailConstraints.pattern)
    @IsStringWithTrim()
    email: string;
}
