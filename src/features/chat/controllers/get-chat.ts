import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from '#Services/redis/message.cache';
import { chatService } from '#Services/db/chat.service';
import { IMessageData } from '#Chat/interfaces/chat.interface';

const messageCache: MessageCache = new MessageCache();

export class GetChat {
  public async conversationList(req: Request, res: Response): Promise<void> {
    let list: IMessageData[] = [];
    const cachedList: IMessageData[] = await messageCache.getUserConversationList(`${req.currentUser!.userId}`);
    if (cachedList.length) {
      list = cachedList;
    } else {
        list = await chatService.getUserConversationList(new mongoose.Types.ObjectId(req.currentUser!.userId));
      }
    if (list.length === 0) {
      res.status(HTTP_STATUS.OK).json({ message: 'Không có cuộc trò chuyện nào', list });
    } else {
      res.status(HTTP_STATUS.OK).json({ message: 'Danh sách cuộc trò chuyện của người dùng', list });
    }
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const { receiverId } = req.params;

    let messages: IMessageData[] = [];
    const cachedMessages: IMessageData[] = await messageCache.getChatMessagesFromCache(`${req.currentUser!.userId}`, `${receiverId}`);
    if (cachedMessages.length) {
      messages = cachedMessages;
    } else {
      messages = await chatService.getMessages(
        new mongoose.Types.ObjectId(req.currentUser!.userId),
        new mongoose.Types.ObjectId(receiverId),
        { createdAt: 1 }
      );
    }

    res.status(HTTP_STATUS.OK).json({ message: 'User chat messages', messages });
  }
}
