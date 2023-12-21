import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IReactionJob } from '#Reaction/interfaces/reaction.interface';
import { ReactionCache } from '#Services/redis/reaction.cache';
import { reactionQueue } from '#Services/queues/reaction.queue';
import { socketIOPostObject } from '#Socket/post.socket';

const reactionCache: ReactionCache = new ReactionCache();

export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { postId, previousReaction, postReactions } = req.params;
    await reactionCache.removePostReactionFromCache(postId, `${req.currentUser!.username}`, JSON.parse(postReactions));
    const databaseReactionData: IReactionJob = {
      postId,
      username: req.currentUser!.username,
      previousReaction
    };
    socketIOPostObject.emit('delete reaction', req.currentUser!.username);
    reactionQueue.addReactionJob('removeReactionFromDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'Bạn đã huỷ thả cảm xúc' });
  }
}
