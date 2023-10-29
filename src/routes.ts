import { authRoutes } from '#Auth/routes/authRoutes';
import { serverAdapter } from '@root/common/services/queues/base.queue';
import { Application } from 'express';
import { currentRoutes } from '#Auth/routes/currentRoutes';
import { authMiddleware } from '@root/common/global/helpers/authen-middlewares';
import { postRoutes } from '#Post/routes/post.route';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signOutRoute());
    // current user
    app.use(BASE_PATH, authMiddleware.verifyUser, currentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
  };
  routes();
};
