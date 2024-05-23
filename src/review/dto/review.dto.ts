import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
    @ApiProperty()
    document_id: string;
    @ApiProperty()
    reviewer_id: string;
    @ApiProperty()
    reviewer_name: string;
    @ApiProperty()
    comment: string;
}

export class UpdateReviewDto {
    @ApiProperty()
    comment: string;
    @ApiProperty()
    status: string;
}