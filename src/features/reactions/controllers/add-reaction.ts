import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { IReactionDocument, IReactionJob } from '#Reaction/interfaces/reaction.interface';
import { addReactionSchema } from '#Reaction/schemas/reaction';
import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { ReactionCache } from '#Services/redis/reaction.cache';
import { reactionQueue } from '#Services/queues/reaction.queue';
import { socketIOPostObject } from '#Socket/post.socket';

const reactionCache: ReactionCache = new ReactionCache();

export class Add {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avatarColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);
    socketIOPostObject.emit('reaction', reactionObject);
    const databaseReactionData: IReactionJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      type,
      previousReaction,
      reactionObject
    };
    reactionQueue.addReactionJob('addReactionToDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'Bạn đã thả cảm xúc cho bài viết' });
  }
}
