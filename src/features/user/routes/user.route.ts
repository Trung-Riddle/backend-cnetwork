import { authMiddleware } from '#Global/helpers/authen-middlewares';
import { Search } from '#User/controllers/search-user';
import express, { Router } from 'express';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/user/profile/search/:query', authMiddleware.checkAuthentication, Search.prototype.user);


    return this.router;
  }
}
export const userRoutes: UserRoutes = new UserRoutes();
