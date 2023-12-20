import { UploadApiResponse } from 'cloudinary';
import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { UserCache } from '#Services/redis/user.cache';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { addChatSchema } from '../schemas/chat';
import { IUserDocument } from '#User/interfaces/user.interface';
import { uploads } from '#Global/helpers/cloudinary-upload';
import { BadRequestError } from '#Global/helpers/errorHandler';
import { config } from '@root/config';
import { IMessageData, IMessageNotification } from '#Chat/interfaces/chat.interface';
import { socketIOChatObject } from '#Socket/chat.socket';
import { INotificationTemplate } from '#Notification/interfaces/notification.interface';
import notificationTemplate from '#Services/email/templates/notifications/notification.template';
import emailQueue from '#Services/queues/email.queue';
import { MessageCache } from '#Services/redis/message.cache';
import chatQueue from '#Services/queues/chat.queue';

const userCache: UserCache = new UserCache();
const messageCache: MessageCache = new MessageCache();

export class AddChat {
  @joiValidation(addChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const {
      conversationId,
      receiverId,
      receiverUsername,
      receiverAvatarColor,
      receiverProfilePicture,
      content,
      gifUrl,
      isRead,
      selectedImage
    } = req.body;
    let fileUrl = '';
    const messageObjectId: ObjectId = new ObjectId();
    const conversationObjectId: ObjectId = !conversationId ? new ObjectId() : new mongoose.Types.ObjectId(conversationId);

    const sender: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;

    if (selectedImage.length) {
      const result: UploadApiResponse = (await uploads(selectedImage, req.currentUser!.userId, true, true)) as UploadApiResponse;
      if (!result?.public_id) {
        throw new BadRequestError(result.message);
      }
      fileUrl = `https://res.cloudinary.com/${config.CLOUDINARY_CLOUD_NAME}/image/upload/v${result.version}/${result.public_id}`;
    }
    const messageData = {
      _id: `${messageObjectId}`,
      conversationId: new mongoose.Types.ObjectId(conversationObjectId),
      receiverId,
      receiverAvatarColor,
      receiverProfilePicture,
      receiverUsername,
      senderUsername: `${req.currentUser!.username}`,
      senderId: `${req.currentUser!.userId}`,
      senderAvatarColor: `${req.currentUser!.avatarColor}`,
      senderProfilePicture: `${sender.profilePicture}`,
      content,
      isRead,
      gifUrl,
      selectedImage: fileUrl,
      reaction: [],
      createdAt: new Date(),
      deleteForEveryone: false,
      deleteForMe: false
    };
    AddChat.prototype.emitSocketIOEvent(messageData);
    // if (!isRead) {
    //   AddChat.prototype.messageNotification({
    //     currentUser: req.currentUser!,
    //     message: content,
    //     receiverName: receiverUsername,
    //     receiverId
    //   });
    // }
    await messageCache.addChatListToCache(`${req.currentUser?.userId}`, `${receiverId}`, `${conversationObjectId}`);
    await messageCache.addChatListToCache(`${receiverId}`, `${req.currentUser?.userId}`, `${conversationObjectId}`);
    await messageCache.addChatMessageToCache(`${conversationObjectId}`, messageData);
    chatQueue.addChatJob('addChatMessageToDB', messageData);
    res.status(HTTP_STATUS.OK).json({ message: 'Tin nhắn được thêm', conversationId: conversationObjectId });
  }
  public async addChatUsers(req: Request, res: Response): Promise<void> {
    const chatUsers = await messageCache.addChatUsersToCache(req.body);
    socketIOChatObject.emit('add chat users', chatUsers);
    res.status(HTTP_STATUS.OK).json({ message: 'Users added' });
  }
  public async removeChatUsers(req: Request, res: Response): Promise<void> {
    const chatUsers = await messageCache.removeChatUsersFromCache(req.body);
    socketIOChatObject.emit('add chat users', chatUsers);
    res.status(HTTP_STATUS.OK).json({ message: 'Users removed' });
  }
  private emitSocketIOEvent(data: IMessageData): void {
    socketIOChatObject.emit('message received', data);
    socketIOChatObject.emit('chat list', data);
  }
  private async messageNotification({ currentUser, message, receiverName, receiverId }: IMessageNotification): Promise<void> {
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${receiverId}`)) as IUserDocument;
    if (cachedUser.notifications.messages) {
      const templateParams: INotificationTemplate = {
        username: receiverName,
        message,
        header: `Tin Nhắn được gửi từ ${currentUser.username}`
      };
      const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
      emailQueue.addEmailJob('directMessageEmail', {
        receiverEmail: cachedUser.email!,
        template,
        subject: `Bạn có tin nhắn từ ${currentUser.username}`
      });
    }
  }
}
