import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { CreateUserDto } from '../../../dto/create/create-user.dto';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
    userEmailValidation,
    userLoginValidation,
} from '../../../domain/validation-rules';

export class CreateUserInputDto implements CreateUserDto {
    @ApiProperty({
        maxLength: userLoginValidation.maxLength,
        minLength: userLoginValidation.minLength,
        pattern: String(userLoginValidation.pattern),
        description: 'Must be unique',
    })
    @IsStringWithTrim(
        userLoginValidation.minLength,
        userLoginValidation.maxLength,
    )
    login: string;

    @ApiProperty({ maxLength: 20, minLength: 6 }) //TODO: move to constants
    @IsString()
    @IsStringWithTrim(6, 20)
    password: string;

    @ApiProperty({
        pattern: String(userEmailValidation.pattern),
        example: 'john@example.com',
        description: 'Must be unique',
    })
    @IsEmail()
    @Matches(userEmailValidation.pattern)
    @IsStringWithTrim()
    email: string;
}
