import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { chatService } from '#Services/db/chat.service';


const log: Logger = config.createLogger('chatWorker');

class ChatWorker {
  async addChatMessageToTB(job: Job, done: DoneCallback): Promise<void> {
    try {
      await chatService.addMessageToDB(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
  async markMessageAsDeleted(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { messageId, type } = job.data;
      await chatService.markMessageAsDeleted(messageId, type);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
  async markMessageAsReadInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { senderId, receiverId } = job.data;
      await chatService.markMessagesAsRead(senderId, receiverId);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
  async updateMessageReaction(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { messageId, senderName, reaction, type } = job.data;
      await chatService.updateMessageReaction(messageId, senderName, reaction, type);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }



}

export const chatWorker: ChatWorker = new ChatWorker();
