import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

class PaginationParams {
    @ApiPropertyOptional({
        type: Number,
        example: 1,
        default: 1,
        description: 'pageNumber is number of portion that should be returned',
    })
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @IsOptional()
    pageNumber: number = 1;

    @ApiPropertyOptional({
        type: Number,
        example: 10,
        default: 10,
        description: 'pageSize is portion size that should be returned',
    })
    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @IsOptional()
    pageSize: number = 10;

    calculateSkip() {
        return (this.pageNumber - 1) * this.pageSize;
    }
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
    @IsEnum(SortDirection)
    @ApiPropertyOptional({
        type: String,
        example: '--',
        default: SortDirection.Desc,
        enum: SortDirection,
    })
    @IsOptional()
    sortDirection: SortDirection = SortDirection.Desc;

    abstract sortBy: T;
}
