import { ICommentDocument, ICommentJob, ICommentNameList, IQueryComment } from '#Comment/interfaces/comment.interface';
import { CommentsModel } from '#Comment/models/comment.schema';
import { IPostDocument } from '#Post/interfaces/post.interface';
import { PostModel } from '#Post/models/post.schema';
import { UserCache } from '#Services/redis/user.cache';
import { IUserDocument } from '#User/interfaces/user.interface';
import mongoose, { Query } from 'mongoose';
import { NotificationModel } from '#Notification/models/notification.schema';
import { INotificationDocument } from '#Notification/interfaces/notification.interface';
import { socketIONotificationObject } from '#Socket/notification.socket';

const userCache = new UserCache();
class CommentService {
  public async addCommentToDB(commentData: ICommentJob): Promise<void> {
    const { postId, userTo, userFrom, username, comment } = commentData;
    const comments: Promise<ICommentDocument> = CommentsModel.create(comment);
    const post: Query<IPostDocument, IPostDocument> = PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: { commentsCount: 1 }
      },
      { new: true }
    ) as Query<IPostDocument, IPostDocument>;
    const user: Promise<IUserDocument> = userCache.getUserFromCache(userTo) as Promise<IUserDocument>;
    const response: [ICommentDocument, IPostDocument, IUserDocument] = await Promise.all([comments, post, user]);
    if (response[2].notifications.comments && userFrom !== userTo) {
      const notificationModel: INotificationDocument = new NotificationModel();
      const notifications = await notificationModel.insertNotification({
        userFrom,
        userTo,
        message: `${username} vừa bình luận bài viết của bạn`,
        notificationType: 'comment',
        entityId: new mongoose.Types.ObjectId(postId),
        createdItemId: new mongoose.Types.ObjectId(response[0]._id!),
        createdAt: new Date(),
        comment: comment.comment,
        post: response[1].post,
        imgId: response[1].imgId!,
        imgVersion: response[1].imgVersion!,
        gifUrl: response[1].gifUrl!,
        reaction: ''
      });
      socketIONotificationObject.emit('insert notification', notifications, { userTo });
    }

  }
  public async getPostComments(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentDocument[]> {
    const comments: ICommentDocument[] = await CommentsModel.aggregate([{ $match: query }, { $sort: sort }]);
    return comments;
  }
  public async getPostCommentName(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentNameList[]> {
    const comments: ICommentNameList[] = await CommentsModel.aggregate([
      { $match: query },
      { $sort: sort },
      { $group: { _id: null, names: { $addToSet: '$username' }, count: { $sum: 1 } } },
      { $project: { $names: 0 } }
    ]);
    return comments;
  }
}

export const commentService: CommentService = new CommentService();
