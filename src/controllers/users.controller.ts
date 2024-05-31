import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaginationReqDto, PaginationResDto } from 'src/common/pagination.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';
import { ApiResponse } from '@nestjs/swagger';
import { CheckUserPrivilegeResDto } from 'src/users/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query(new ValidationPipe({ transform: true })) query: PaginationReqDto,
    @Res() res,
  ): Promise<PaginationResDto<User>> {
    const result = await this.usersService.getAllUsers(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/privilege')
  @ApiResponse({
    status: 200,
    description: 'Check user privilege',
    type: CheckUserPrivilegeResDto,
  })
  @UseGuards(JwtAuthGuard, UserGuard)
  async getPrivilege(@Req() req, @Res() res) {
    const result = await this.usersService.checkUserPrivilege(req.user);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:userId')
  async getUserById(@Param('userId') id: string, @Res() res) {
    const result = await this.usersService.getUserById(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
