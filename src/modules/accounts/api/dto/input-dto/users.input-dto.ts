import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { CreateUserDto } from '../../../dto/create/create-user.dto';
import { UpdateUserDto } from '../../../dto/update/update-user.dto';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';

import {
    userEmailConstraints,
    userLoginConstraints,
    userPasswordConstraints,
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

    @ApiProperty({
        maxLength: userPasswordConstraints.maxLength,
        minLength: userPasswordConstraints.minLength,
    })
    @IsString()
    @IsStringWithTrim(
        userPasswordConstraints.minLength,
        userPasswordConstraints.maxLength,
    )
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

export class UpdateUserInputDto implements UpdateUserDto {
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
