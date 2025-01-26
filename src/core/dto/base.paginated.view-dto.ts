import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginatedViewDto<T> {
    @ApiProperty()
    totalCount: number;
    @ApiProperty()
    pagesCount: number;
    @ApiProperty()
    page: number;
    @ApiProperty()
    pageSize: number;
    abstract items: T;

    public static mapToView<T>(data: {
        items: T;
        page: number;
        size: number;
        totalCount: number;
    }): PaginatedViewDto<T> {
        return {
            totalCount: data.totalCount,
            pagesCount: Math.ceil(data.totalCount / data.size),
            page: data.page,
            pageSize: data.size,
            items: data.items,
        };
    }
}
