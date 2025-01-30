import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';
import { IsString, Length } from 'class-validator';

export const IsStringWithTrim = (minLength: number = 1, maxLength?: number) =>
    applyDecorators(IsString(), Length(minLength, maxLength), Trim());
