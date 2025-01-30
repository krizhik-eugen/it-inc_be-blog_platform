import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () =>
    Transform(({ value }: TransformFnParams): typeof value =>
        typeof value === 'string' ? value.trim() : value,
    );
