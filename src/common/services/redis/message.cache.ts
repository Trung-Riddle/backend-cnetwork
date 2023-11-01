import { BaseCache } from '#Services/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '#Global/helpers/errorHandler';

const log: Logger = config.createLogger('messageCache');

export class MessageCache extends BaseCache {
  constructor() {
    super('messageCache');
  }

  public async addChatListToCache(senderId: string, receiverId: string, conversationId: string): Promise<void> {
    try {

    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
