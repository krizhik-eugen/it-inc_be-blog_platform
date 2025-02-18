import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../exceptions';

export class ErrorViewDto extends ErrorResponse {
    @ApiProperty({
        type: 'string',
        nullable: true,
        description: 'Message with error explanation for certain field',
    })
    field: string | null;

    @ApiProperty({
        type: 'string',
        nullable: true,
        description: 'Which field/property of input model has error',
    })
    message: string;
}

export class HttpErrorResponse {
    errorsMessages: Array<ErrorResponse | string>;
}
export class HttpErrorViewDto extends HttpErrorResponse {
    @ApiProperty({ type: [ErrorViewDto], nullable: true, required: false })
    errorsMessages: Array<ErrorResponse | string>;
}
