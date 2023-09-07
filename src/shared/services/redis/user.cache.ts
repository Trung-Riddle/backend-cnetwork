import { ServerError } from '#Global/helpers/errorHandler';
import { BaseCache } from '#Services/redis/base.cache';
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
      '_id': `${_id}`,
      'uId': `${uId}`,
      'username': `${username}`,
      'fullName': `${fullName}`,
      'birthday': `${birthday}`,
      'email': `${email}`,
      'avatarColor': `${avatarColor}`,
      'blocked': JSON.stringify(blocked),
      'blockedBy': JSON.stringify(blockedBy),
      'profilePicture': `${profilePicture}`,
      'followersCount': `${followersCount}`,
      'followingCount': `${followingCount}`,
      'relatives': JSON.stringify(relatives),
      'notifications': JSON.stringify(notifications),
      'work': `${work}`,
      'school': `${school}`,
      'location': `${location}`,
      'quote': `${quote}`,
      'bgImageCover': `${bgImageCover}`,
      'bgImageId': `${bgImageId}`,
      'social': JSON.stringify(social),
      'createdAt': `${createdAt}`,
    };
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userUid, 10), value: `${key}`});
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error, try again!');
    }

  }
}
