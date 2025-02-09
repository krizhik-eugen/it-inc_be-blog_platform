import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { CreateUserDto } from '../../../dto/create/create-user.dto';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';
import {
    userEmailConstraints,
    userLoginConstraints,
} from '../../../domain/user.entity';

export class CreateUserInputDto implements CreateUserDto {
    @ApiProperty({
        maxLength: userLoginConstraints.maxLength,
        minLength: userLoginConstraints.minLength,
        pattern: String(userLoginConstraints.pattern),
        description: 'Must be unique',
    })
    @IsStringWithTrim(
        userLoginConstraints.minLength,
        userLoginConstraints.maxLength,
    )
    login: string;

    @ApiProperty({ maxLength: 20, minLength: 6 }) //TODO: move to constants
    @IsString()
    @IsStringWithTrim(6, 20)
    password: string;

    @ApiProperty({
        pattern: String(userEmailConstraints.pattern),
        example: 'john@example.com',
        description: 'Must be unique',
    })
    @IsEmail()
    @Matches(userEmailConstraints.pattern)
    @IsStringWithTrim()
    email: string;
}

export class LoginUserInputDto {
    @ApiProperty()
    loginOrEmail: string;
    @ApiProperty()
    password: string;
}
