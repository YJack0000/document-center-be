import { ApiProperty } from '@nestjs/swagger';

export class AssignReviewerDto {
  @ApiProperty()
  reviewerId: string;
}

export class CreateReviewDto {
  @ApiProperty()
  comment: string;
}
