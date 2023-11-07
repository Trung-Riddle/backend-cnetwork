import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server as ServerSocketIO } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import 'express-async-errors';
import compression from 'compression';
import Logger from 'bunyan';
import { config } from '@root/config';
import ApplicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@root/common/global/helpers/errorHandler';
import { SocketIOPostHandler } from '#Socket/post.socket';
import { SocketIOChatHandler } from '#Socket/chat.socket';
import { SocketIOFollowerHandler } from '#Socket/follower.socket';
import { SocketIOUserHandler } from '#Socket/user';

const SERVER_PORT = 4080;
const log: Logger = config.createLogger('server');
export class Lime8Server {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development' // false
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
    console.log(config.CLIENT_URL);
  }
  private standardMiddleware(app: Application): void {
    app.use(compression()); // nén data trc khi gửi về client , cải thiện hiệu suất mạng
    app.use(
      json({
        limit: '50mb'
      })
    );
    app.use(
      urlencoded({
        limit: '50mb',
        extended: true
      })
    );
  }
  private routesMiddleware(app: Application): void {
    ApplicationRoutes(app);
  }
  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeError());
      }
      next();
    });
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
      const socketIO: ServerSocketIO = await this.createSocketIO(httpServer);
      this.socketIOConnection(socketIO);
    } catch (error) {
      log.error(error);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<ServerSocketIO> {
    const io: ServerSocketIO = new ServerSocketIO(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info('Server running on port ' + SERVER_PORT);
    });
  }
  private socketIOConnection(io: ServerSocketIO): void {
    // log.info('socketIOConnection');
    const postSocketHandler: SocketIOPostHandler = new SocketIOPostHandler(io);
    const messageSocketHandler: SocketIOChatHandler = new SocketIOChatHandler(io);
    const followerSocketHandler: SocketIOFollowerHandler = new SocketIOFollowerHandler(io);
    const socketIOUserHandler: SocketIOUserHandler = new SocketIOUserHandler(io);

    postSocketHandler.listen();
    followerSocketHandler.listen();
    messageSocketHandler.listen();
    socketIOUserHandler.listen();
  }
}
