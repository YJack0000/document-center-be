import { ApiProperty } from '@nestjs/swagger';

export class CheckUserPrivilegeResDto {
  @ApiProperty({ example: true })
  isSuperUser: boolean;
}
