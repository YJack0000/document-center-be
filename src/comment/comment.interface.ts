import { BaseInterfaceRepository } from 'src/common/base.interface';
import { Comment } from './comment.entity';

export interface ICommentRepository
    extends BaseInterfaceRepository<Comment> { }

export const ICommentRepository = Symbol('ICommentRepository');