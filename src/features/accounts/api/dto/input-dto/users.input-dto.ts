import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../../dto/create/create-user.dto';
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
    login: string;

    @ApiProperty({ maxLength: 20, minLength: 6 }) //TODO: move to constants
    password: string;

    @ApiProperty({
        pattern: String(userEmailValidation.pattern),
        example: 'john@example.com',
        description: 'Must be unique',
    })
    email: string;
}
