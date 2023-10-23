import { ServerError } from '@root/common/global/helpers/errorHandler';
import { Helper } from '@root/common/global/helpers/helper';
import { BaseCache } from '@root/common/services/redis/base.cache';
import { IUserDocument } from '#User/interfaces/user.interface';
import { config } from '@root/config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('userCache');
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
      bgImageCover,
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
      bgImageCover: `${bgImageCover}`,
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
      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
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
      response.bgImageCover = Helper.parseJson(`${response.bgImageCover}`);
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
}
