import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Res() res) {
    const result = await this.usersService.getAllUsers();
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:userId')
  async getUserById(@Param("userId") id: string, @Res() res) {
    const result = await this.usersService.getUserById(id);
		return res.status(HttpStatus.OK).json(result);
  }
}
