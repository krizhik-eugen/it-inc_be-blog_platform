import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
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
    @ApiProperty({ type: [ErrorResponse], nullable: true, required: false })
    errorsMessages: Array<ErrorResponse | string>;
}
