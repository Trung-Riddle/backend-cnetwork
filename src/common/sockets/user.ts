import { ILogin, ISocketData } from '#User/interfaces/user.interface';
import { Server, Socket } from 'socket.io';

export let socketIOUserObject: Server;
export const connectedUsersMap: Map<string, string> = new Map();

export class SocketIOUserHandler {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }
  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Connected user socket');
    });
  }
}
