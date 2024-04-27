import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWTSECRET } from 'src/config';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { UserService } from '../user.service';

//Auth Middleware
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, JWTSECRET);
      if (typeof decoded === 'object' && 'id' in decoded) {
        const user = await this.userService.findById(decoded.id);
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
