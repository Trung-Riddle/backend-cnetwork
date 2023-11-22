import { authMiddleware } from '#Global/helpers/authen-middlewares';
import { Add } from '#Reaction/controllers/add-reaction';
import { Get } from '#Reaction/controllers/get-reaction';
import { Remove } from '#Reaction/controllers/remove-reaction';
import express, { Router } from 'express';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/reaction/:postId', authMiddleware.checkAuthentication, Get.prototype.reaction);
    this.router.get('/post/single/reaction/:username/:postId', authMiddleware.checkAuthentication, Get.prototype.singleReactionByUsername);
    this.router.get('/post/reaction/:username', authMiddleware.checkAuthentication, Get.prototype.reactionsByUsername);
    this.router.post('/post/reaction', authMiddleware.checkAuthentication, Add.prototype.reaction);
    this.router.delete(
      '/post/reaction/:postId/:previousReaction/:postReactions',
      authMiddleware.checkAuthentication,
      Remove.prototype.reaction
    );

    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
