import express, { Router } from 'express';
import { AddImage } from '#Image/controllers/add-image';
import { Get } from '#Image/controllers/get-image';
import { authMiddleware } from '#Global/helpers/authen-middlewares';
import { Delete } from '#Image/controllers/delete-image';

class ImageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/images/:userId', authMiddleware.checkAuthentication, Get.prototype.images);
    this.router.post('/images/profile', authMiddleware.checkAuthentication, AddImage.prototype.profileImage);
    this.router.post('/images/background', authMiddleware.checkAuthentication, AddImage.prototype.backgroundImage);
    this.router.delete('/images/:imageId', authMiddleware.checkAuthentication, Delete.prototype.image);
    this.router.delete('/images/background/:bgImageId', authMiddleware.checkAuthentication, Delete.prototype.backgroundImage);

    return this.router;
  }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();
