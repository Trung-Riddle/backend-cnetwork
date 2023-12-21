import followerQueue from '#Services/queues/follower.queue';
import { FollowerCache } from '#Services/redis/follower.cache';
import { socketIOFollowerObject } from '#Socket/follower.socket';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followeeId, followerId } = req.params;
    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(
      `following:${req.currentUser!.userId}`,
      followeeId
    );
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
    await Promise.all([removeFollowerFromCache, removeFolloweeFromCache, followersCount, followeeCount]);
    socketIOFollowerObject.emit('remove follower', {
      followeeId,
      followersCount: 1
    });

    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: `${followeeId}`,
      keyTwo: `${followerId}`
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Bạn đã huỷ theo dõi' });
  }
}
