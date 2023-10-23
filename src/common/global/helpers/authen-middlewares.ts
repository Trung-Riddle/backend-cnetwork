import { Response, Request, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { NotAuthorizedError } from './errorHandler';
import { AuthPayload } from '#Auth/interfaces/auth.interface';

export class AuthenMiddlewares {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.');
    }
    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is invalid. Please login again.');
    }
    next();
  }
  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route.');
    }
    next();
  }
}
export const authMiddleware: AuthenMiddlewares = new AuthenMiddlewares();
