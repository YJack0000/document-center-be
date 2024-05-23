import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    document_id: string;
    @ApiProperty()
    user_id: string;
    @ApiProperty()
    user_name: string;
    @ApiProperty()
    content: string;
}

export class UpdateCommentDto {
    @ApiProperty()
    content: string;
}