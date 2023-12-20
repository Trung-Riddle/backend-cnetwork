import { AddUser } from '#Follower/controllers/block-user';
import { AddFollower } from '#Follower/controllers/follower-user';
import { GetFlollower } from '#Follower/controllers/get-followers';
import { Remove } from '#Follower/controllers/unfollow';
import { authMiddleware } from '#Global/helpers/authen-middlewares';
import express, { Router } from 'express';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/user/following', authMiddleware.checkAuthentication, GetFlollower.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, GetFlollower.prototype.userFollowers);

    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, AddFollower.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);
    this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.block);
    this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.unblock);

    return this.router;
  }
}
export const followerRoutes: FollowerRoutes = new FollowerRoutes();
