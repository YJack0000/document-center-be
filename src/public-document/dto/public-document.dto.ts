import { ApiProperty } from '@nestjs/swagger';

export class UpdatePublicDocumentStatusDto {
  @ApiProperty()
  isPublic: boolean;
}
