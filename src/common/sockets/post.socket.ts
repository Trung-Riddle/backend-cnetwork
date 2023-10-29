import { Server, Socket } from 'socket.io';
import { ICommentDocument } from '#Comment/interfaces/comment.interface';
import { IReaction } from '#Reaction/interfaces/reaction.interface';

export let socketIOPostObject: Server;
export class SocketIOPostHandler {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
  }
  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Post socketio handler');
    });
  }
}
