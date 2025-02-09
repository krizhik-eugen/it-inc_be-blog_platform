import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { userEmailConstraints } from '../../../domain/user.entity';
import { IsEmail, Matches } from 'class-validator';

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
