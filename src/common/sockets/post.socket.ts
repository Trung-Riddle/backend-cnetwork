import { Server, Socket } from 'socket.io';
import { ICommentDocument } from '#Comment/interfaces/comment.interface';
import { IReaction, IReactionDocument } from '#Reaction/interfaces/reaction.interface';

export let socketIOPostObject: Server;
export class SocketIOPostHandler {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }
  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('reaction', (reaction: IReactionDocument) => {
        this.io.emit('update like', reaction);
      });
      socket.on('comment', (data: ICommentDocument) => {
        this.io.emit('update comment', data);
      });

      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
      });
    });
  }
}
