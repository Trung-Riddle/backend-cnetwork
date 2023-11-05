import { BaseQueue } from '@root/common/services/queues/base.queue';
import { chatWorker } from '#Worker/chat.worker';
import { IChatJobData, IMessageData } from '#Chat/interfaces/chat.interface';

class ChatQueue extends BaseQueue {
  constructor() {
    super('chats');
    this.processJob('addChatMessageToDB', 5, chatWorker.addChatMessageToTB);
    this.processJob('markMessageAsDeletedInDB', 5, chatWorker.markMessageAsDeleted);
    this.processJob('markMessageAsReadInDB', 5, chatWorker.markMessageAsReadInDB);
    this.processJob('updateMessageReaction', 5, chatWorker.updateMessageReaction);
  }
  public addChatJob(name: string, data: IChatJobData | IMessageData): void {
    this.addJob(name, data);
  }
}
export default new ChatQueue();
