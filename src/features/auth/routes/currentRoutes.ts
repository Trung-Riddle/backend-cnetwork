import { CurrentUser } from '#Auth/controllers/current-user';
import { authMiddleware } from '@root/common/global/helpers/authen-middlewares';
import express, { Router } from 'express';

class CurrentRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);
    return this.router;
  }
}

export const currentRoutes: CurrentRoutes = new CurrentRoutes();
