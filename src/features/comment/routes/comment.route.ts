import { AddComment } from '#Comment/controllers/add-comment';
import { Get } from '#Comment/controllers/get-comment';
import { GetFlollower } from '#Follower/controllers/get-followers';
import { authMiddleware } from '#Global/helpers/authen-middlewares';
import express, { Router } from 'express';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/post/comments/:postId', authMiddleware.checkAuthentication, Get.prototype.comments);
    this.router.get('/post/comments-name/:postId', authMiddleware.checkAuthentication, Get.prototype.commentsNamesFromCache);
    this.router.get('/post/single-comment/:postId/:commentId', authMiddleware.checkAuthentication, Get.prototype.singleComment);
    this.router.post('/post/comment', authMiddleware.checkAuthentication, AddComment.prototype.comment);
    return this.router;
  }
}
export const commentRoutes: CommentRoutes = new CommentRoutes();
