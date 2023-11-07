import { authRoutes } from '#Auth/routes/authRoutes';
import { serverAdapter } from '@root/common/services/queues/base.queue';
import { Application } from 'express';
import { currentRoutes } from '#Auth/routes/currentRoutes';
import { authMiddleware } from '@root/common/global/helpers/authen-middlewares';
import { postRoutes } from '#Post/routes/post.route';
import { chatRoutes } from '#Chat/routes/chat.route';
import { userRoutes } from '#User/routes/user.route';
import { followerRoutes } from '#Follower/routes/follower.route';
import { reactionRoutes } from '#Reaction/routes/reaction.route';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signOutRoute());
    // current user
    app.use(BASE_PATH, authMiddleware.verifyUser, currentRoutes.routes());
    // more
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
  };
  routes();
};
