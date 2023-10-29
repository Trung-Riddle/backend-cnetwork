import { authMiddleware } from '@root/common/global/helpers/authen-middlewares';
import express, { Router } from 'express';
import { CreatePost } from '#Post/controllers/create-post';
import { Get } from '#Post/controllers/get-post';

class PostRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/post/add', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/add-image', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);
    this.router.get('/post/all-post/:page', authMiddleware.checkAuthentication, Get.prototype.posts);
    this.router.get('/post/all-image/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithImages);
    this.router.get('/post/all-video/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithVideos);
    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
