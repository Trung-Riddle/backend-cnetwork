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
import { commentRoutes } from '#Comment/routes/comment.route';
import { notificationRoutes } from '#Notification/routes/notification.route';
import { imageRoutes } from '#Image/routes/image.route';
import { healthRoutes } from '#User/routes/heath.route';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use('', healthRoutes.health());
    app.use('', healthRoutes.env());
    app.use('', healthRoutes.instance());
    app.use('', healthRoutes.fiboRoutes());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signOutRoute());
    // current user
    app.use(BASE_PATH, authMiddleware.verifyUser, currentRoutes.routes());
    // more
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, imageRoutes.routes());
  };
  routes();
};
