import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import { userEmailValidation } from '../../../domain/validation-rules';
import { IsEmail, Matches } from 'class-validator';

export class PasswordRecoveryInputDto {
    @ApiProperty({
        pattern: String(userEmailValidation.pattern),
        example: 'john@example.com',
        description: 'Email of registered user',
    })
    @IsEmail()
    @Matches(userEmailValidation.pattern)
    @IsStringWithTrim()
    email: string;
}
