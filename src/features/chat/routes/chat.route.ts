import { AddChat } from '#Chat/controllers/add-chat';
import { authMiddleware } from '#Global/helpers/authen-middlewares';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/chat/message', authMiddleware.checkAuthentication, AddChat.prototype.message);
    this.router.post('/chat/add-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.addChatUsers);

    return this.router;
  }
}
export const chatRoutes: ChatRoutes = new ChatRoutes();
