import { ApiProperty } from '@nestjs/swagger';

export class CheckUserPrivilegeResDto {
  @ApiProperty({ enum: ['user', 'superuser'] })
  privilege: string;
}
