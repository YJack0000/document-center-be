import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto, GetCommentDto } from 'src/comment/dto/comment.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserGuard } from 'src/guard/user.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(@Query() query: GetCommentDto, @Res() res) {
    const result = await this.commentService.getAllComments(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserGuard)
  async createComment(@Req() req, @Body() body: CreateCommentDto, @Res() res) {
    const result = await this.commentService.createComment(req.user, body);
    return res.status(HttpStatus.OK).json(result);
  }
}
