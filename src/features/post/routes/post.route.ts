import { authMiddleware } from '@root/common/global/helpers/authen-middlewares';
import express, { Router } from 'express';
import { CreatePost } from '#Post/controllers/create-post';
import { Get } from '#Post/controllers/get-post';
import { Update } from '#Post/controllers/update-post';
import { Delete } from '#Post/controllers/delete-post';

class PostRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/post/add', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/add-image', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);
    this.router.post('/post/add-video', authMiddleware.checkAuthentication, CreatePost.prototype.postWithVideo);
    this.router.get('/post/all-post/:page', authMiddleware.checkAuthentication, Get.prototype.posts);
    this.router.get('/post/all-image/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithImages);
    this.router.get('/post/all-video/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithVideos);

    this.router.put('/post/:postId', authMiddleware.checkAuthentication, Update.prototype.posts);
    this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithImage);
    this.router.put('/post/video/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithVideo);

    this.router.delete('/post/:postId', authMiddleware.checkAuthentication, Delete.prototype.post);
    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
