import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';
import { ServerError } from '@root/common/global/helpers/errorHandler';
import { Helper } from '@root/common/global/helpers/helper';
import { BaseCache } from '@root/common/services/redis/base.cache';
import { INotificationSettings, ISocialLinks, IUserDocument } from '#User/interfaces/user.interface';
import { config } from '@root/config';
import Logger from 'bunyan';
import { findIndex, indexOf } from 'lodash';

const log: Logger = config.createLogger('userCache');
type UserItem = string | ISocialLinks | INotificationSettings;
type UserCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IUserDocument | IUserDocument[];
export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }
  public async saveUserToCache(key: string, userUid: string, createUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      fullName,
      birthday,
      email,
      avatarColor,
      blocked,
      blockedBy,
      profilePicture,
      followersCount,
      followingCount,
      postsCount,
      relatives,
      notifications,
      work,
      school,
      location,
      quote,
      bgImageVersion,
      bgImageId,
      social
    } = createUser;

    const dataToSave = {
      _id: `${_id}`,
      uId: `${uId}`,
      username: `${username}`,
      fullName: `${fullName}`,
      birthday: `${birthday}`,
      email: `${email}`,
      avatarColor: `${avatarColor}`,
      blocked: JSON.stringify(blocked),
      blockedBy: JSON.stringify(blockedBy),
      profilePicture: `${profilePicture}`,
      followersCount: `${followersCount}`,
      followingCount: `${followingCount}`,
      postsCount: `${postsCount}`,
      relatives: JSON.stringify(relatives),
      notifications: JSON.stringify(notifications),
      work: `${work}`,
      school: `${school}`,
      location: `${location}`,
      quote: `${quote}`,
      bgImageVersion: `${bgImageVersion}`,
      bgImageId: `${bgImageId}`,
      social: JSON.stringify(social),
      createdAt: `${createdAt}`
    };
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUid, 10), value: `${key}` });
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error, try again!');
    }
  }
  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: IUserDocument = (await this.client.hGetAll(`users:${userId}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helper.parseJson(`${response.createdAt}`));
      response.postsCount = Helper.parseJson(`${response.postsCount}`);
      response.blockedBy = Helper.parseJson(`${response.blockedBy}`);
      response.blocked = Helper.parseJson(`${response.blocked}`);
      response.notifications = Helper.parseJson(`${response.notifications}`);
      response.relatives = Helper.parseJson(`${response.relatives}`);
      response.social = Helper.parseJson(`${response.social}`);
      response.followersCount = Helper.parseJson(`${response.followersCount}`);
      response.followingCount = Helper.parseJson(`${response.followingCount}`);
      response.profilePicture = Helper.parseJson(`${response.profilePicture}`);
      response.bgImageVersion = Helper.parseJson(`${response.bgImageVersion}`);
      response.bgImageId = Helper.parseJson(`${response.bgImageId}`);
      response.birthday = Helper.parseJson(`${response.birthday}`);
      response.work = Helper.parseJson(`${response.work}`);
      response.school = Helper.parseJson(`${response.school}`);
      response.location = Helper.parseJson(`${response.location}`);
      response.quote = Helper.parseJson(`${response.quote}`);
      // more
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again!');
    }
  }
  public async getUsersFromCache(start: number, end: number, excludedUserKey: string): Promise<IUserDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.ZRANGE('user', start, end, { REV: true });
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      for (const key of response) {
        if (key !== excludedUserKey) {
          multi.HGETALL(`users:${key}`);
        }
      }
      const replies: UserCacheMultiType = (await multi.exec()) as UserCacheMultiType;
      const userReplies: IUserDocument[] = [];
      for (const reply of replies as IUserDocument[]) {
        reply.createdAt = new Date(Helper.parseJson(`${reply.createdAt}`));
        reply.postsCount = Helper.parseJson(`${reply.postsCount}`);
        reply.blocked = Helper.parseJson(`${reply.blocked}`);
        reply.blockedBy = Helper.parseJson(`${reply.blockedBy}`);
        reply.notifications = Helper.parseJson(`${reply.notifications}`);
        reply.social = Helper.parseJson(`${reply.social}`);
        reply.followersCount = Helper.parseJson(`${reply.followersCount}`);
        reply.followingCount = Helper.parseJson(`${reply.followingCount}`);
        reply.bgImageId = Helper.parseJson(`${reply.bgImageId}`);
        reply.bgImageVersion = Helper.parseJson(`${reply.bgImageVersion}`);
        reply.profilePicture = Helper.parseJson(`${reply.profilePicture}`);

        userReplies.push(reply);
      }
      return userReplies;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
  public async getRandomUsersFromCache(userId: string, excludedUsername: string): Promise<IUserDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const replies: IUserDocument[] = [];
      const followers: string[] = await this.client.LRANGE(`followers:${userId}`, 0, -1);
      const users: string[] = await this.client.ZRANGE('user', 0, -1);
      const randomUsers: string[] = Helper.shuffle(users).slice(0, 10);
      for (const key of randomUsers) {
        const followerIndex = indexOf(followers, key);
        if (followerIndex < 0) {
          const userHash: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
          replies.push(userHash);
        }
      }
      const excludedUsernameIndex: number = findIndex(replies, ['username', excludedUsername]);
      replies.splice(excludedUsernameIndex, 1);
      for (const reply of replies) {
        reply.createdAt = new Date(Helper.parseJson(`${reply.createdAt}`));
        reply.postsCount = Helper.parseJson(`${reply.postsCount}`);
        reply.blocked = Helper.parseJson(`${reply.blocked}`);
        reply.blockedBy = Helper.parseJson(`${reply.blockedBy}`);
        reply.notifications = Helper.parseJson(`${reply.notifications}`);
        reply.social = Helper.parseJson(`${reply.social}`);
        reply.followersCount = Helper.parseJson(`${reply.followersCount}`);
        reply.followingCount = Helper.parseJson(`${reply.followingCount}`);
        reply.bgImageId = Helper.parseJson(`${reply.bgImageId}`);
        reply.bgImageVersion = Helper.parseJson(`${reply.bgImageVersion}`);
        reply.profilePicture = Helper.parseJson(`${reply.profilePicture}`);
        reply.work = Helper.parseJson(`${reply.work}`);
        reply.school = Helper.parseJson(`${reply.school}`);
        reply.location = Helper.parseJson(`${reply.location}`);
        reply.quote = Helper.parseJson(`${reply.quote}`);
        reply.birthday = Helper.parseJson(`${reply.birthday}`);
      }
      return replies;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
  public async updateSingleUserItemInCache(userId: string, prop: string, value: UserItem): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET(`users:${userId}`, `${prop}`, JSON.stringify(value));
      const response: IUserDocument = (await this.getUserFromCache(userId)) as IUserDocument;
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
  public async getTotalUsersInCache(): Promise<number> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const count: number = await this.client.ZCARD('user');
      return count;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
