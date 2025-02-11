import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { Trim } from '../transform/trim';

export const IsStringWithTrim = (minLength: number = 1, maxLength?: number) =>
    applyDecorators(IsString(), Length(minLength, maxLength), Trim());
