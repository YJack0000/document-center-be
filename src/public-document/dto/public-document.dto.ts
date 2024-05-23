import { ApiProperty } from "@nestjs/swagger";

export class CreatePublicDocumentDto {
    @ApiProperty()
    ownerId: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    public: boolean;
}

export class UpdatePublicDocumentDto {
    @ApiProperty()
    title: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    public: boolean;
}