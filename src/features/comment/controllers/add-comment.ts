import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { CommentCache } from '#Services/redis/comment.cache';
import commentQueue from '#Services/queues/comment.queue';
import { ICommentDocument, ICommentJob } from '#Comment/interfaces/comment.interface';
import { addCommentSchema } from '#Comment/schemas/comment';
import { socketIOPostObject } from '#Socket/post.socket';

const commentCache: CommentCache = new CommentCache();

export class AddComment {
  @joiValidation(addCommentSchema)
  public async comment(req: Request, res: Response): Promise<void> {
    const { userTo, postId, profilePicture, comment } = req.body;
    const commentObjectId: ObjectId = new ObjectId();

    const commentData: ICommentDocument = {
      _id: commentObjectId,
      postId,
      username: `${req.currentUser?.username}`,
      avatarColor: `${req.currentUser?.avatarColor}`,
      profilePicture,
      comment,
      createdAt: new Date()
    } as ICommentDocument;
    socketIOPostObject.emit('add comment', commentData);
    await commentCache.savePostCommentToCache(postId, JSON.stringify(commentData));
    const dbCmtData: ICommentJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      comment: commentData
    };
    commentQueue.addCommentJob('addCommentToDB', dbCmtData);
    res.status(HTTP_STATUS.OK).json({ message: 'Vừa đăng bình luận' });
  }
}
