import { IFollower, IFollowerData, IFollowers } from '#Follower/interfaces/follwer.interface';
import { followerService } from '#Services/db/follower.service';
import { FollowerCache } from '#Services/redis/follower.cache';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';


const followerCache: FollowerCache = new FollowerCache();
export class GetFlollower {
  public async userFollowing(req: Request, res: Response): Promise<void> {
    const userObjId: ObjectId = new mongoose.Types.ObjectId(req.currentUser!.userId);
    const cachedFollers: IFollowerData[] = await followerCache.getFollowersFromCache(`following:${req.currentUser!.userId}`);
    const following: IFollowerData[] = cachedFollers.length ? cachedFollers : await followerService.getFolloweeData(userObjId);

    res.status(HTTP_STATUS.OK).json({ message: 'User following', following });
  }
  public async userFollowers(req: Request, res: Response): Promise<void> {
    const userObjId: ObjectId = new mongoose.Types.ObjectId(req.params.userId);
    const cachedFollers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${req.params.userId}`);
    const followers: IFollowerData[] = cachedFollers.length ? cachedFollers : await followerService.getFollowerData(userObjId);

    res.status(HTTP_STATUS.OK).json({ message: 'User follower', followers });
  }
}
