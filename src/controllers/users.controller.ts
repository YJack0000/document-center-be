import { Controller, Get, HttpStatus, Param, Query, Res, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { User } from 'src/users/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<User>> {
    console.log(query);
    const result = await this.usersService.getAllUsers(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:userId')
  async getUserById(@Param('userId') id: string, @Res() res) {
    const result = await this.usersService.getUserById(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
