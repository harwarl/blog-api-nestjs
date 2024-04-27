import { Request } from 'express';
import { User } from 'src/user/user.entity';

export interface ExpressRequest extends Request {
  user?: User;
}

export interface IDeleteResponse {}
