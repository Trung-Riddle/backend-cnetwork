import { AddChat } from '#Chat/controllers/add-chat';
import { Message } from '#Chat/controllers/add-message-reaction';
import { Delete } from '#Chat/controllers/delete-chat';
import { GetChat } from '#Chat/controllers/get-chat';
import { Update } from '#Chat/controllers/update-chat';
import { authMiddleware } from '#Global/helpers/authen-middlewares';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/chat/conversation-list', authMiddleware.checkAuthentication, GetChat.prototype.conversationList);
    this.router.get('/chat/user/:receiverId', authMiddleware.checkAuthentication, GetChat.prototype.messages);
    this.router.post('/chat/message', authMiddleware.checkAuthentication, AddChat.prototype.message);
    this.router.post('/chat/add-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.addChatUsers);
    this.router.post('/chat/remove-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.removeChatUsers);
    this.router.put('/chat/mark-as-read', authMiddleware.checkAuthentication, Update.prototype.message);
    this.router.put('/chat/reaction', authMiddleware.checkAuthentication, Message.prototype.reaction);
    this.router.delete(
      '/chat/user/mark-as-deleted/:messageId/:senderId/:receiverId/:type',
      authMiddleware.checkAuthentication,
      Delete.prototype.markMessageAsDeleted
    );

    return this.router;
  }
}
export const chatRoutes: ChatRoutes = new ChatRoutes();
