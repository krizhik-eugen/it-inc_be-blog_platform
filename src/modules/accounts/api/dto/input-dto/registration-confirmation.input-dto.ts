import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';

export class RegistrationConfirmationInputDto {
    @ApiProperty({ description: 'Code that has been sent with link via Email' })
    @IsStringWithTrim()
    code: string;
}
