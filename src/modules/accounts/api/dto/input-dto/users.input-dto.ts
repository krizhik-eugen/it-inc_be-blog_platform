import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation';
import { CreateUserDto } from '../../../dto/create';
import { UpdateUserDto } from '../../../dto/update';

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
    @IsStringWithTrim()
    loginOrEmail: string;
    @ApiProperty()
    @IsStringWithTrim(
        userPasswordConstraints.minLength,
        userPasswordConstraints.maxLength,
    )
    password: string;
}
