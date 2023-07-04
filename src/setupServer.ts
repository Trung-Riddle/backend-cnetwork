import { Application, json, urlencoded, Response, Request, NextFunction } from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import cookieSession from 'cookie-session'
import HTTP_STATUS from 'http-status-codes'
import { Server as ServerSocketIO } from 'socket.io'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'
import 'express-async-errors'
import compression from 'compression'
import { config } from './config'
import ApplicationRoutes from './routes'
import { CustomError, IError, IErrorResponse } from './shared/global/helpers/errorHandler'

const SERVER_PORT = 4080
export class Lime8Server {
    private app: Application;
    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app)
        this.standardMiddleware(this.app)
        this.routesMiddleware(this.app)
        this.globalErrorHandler(this.app)
        this.startServer(this.app)
    }
    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
                maxAge: 24 * 7 * 3600000,
                secure: config.NODE_ENV !== 'development' // false
            })
        )
        app.use(hpp())
        app.use(helmet())
        app.use(cors({
            origin: config.CLIENT_URL, 
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }))
    }
    private standardMiddleware(app: Application): void {
        app.use(compression()) // nén data trc khi gửi về client , cải thiện hiệu suất mạng
        app.use(json({
            limit: '50mb'
        }))
        app.use(urlencoded({
            limit: '50mb',
            extended: true
        }))
    }
    private routesMiddleware(app: Application): void {
        ApplicationRoutes(app)
    }
    private globalErrorHandler(app: Application): void {
        app.all('*', (req: Request, res: Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json( {message: `${req.originalUrl} not found`})
        })
        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            console.log(error)
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeError)
            }
            next()
        })
    }
    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app)
            this.startHttpServer(httpServer)
            const socketIO: ServerSocketIO = await this.createSocketIO(httpServer)
            this.socketIOConnection(socketIO)
        } catch (error) {
            console.log(error)
        }
    }
    private async createSocketIO(httpServer: http.Server): Promise<ServerSocketIO> {
        const io: ServerSocketIO = new ServerSocketIO(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        })
        const pubClient = createClient({ url: config.REDIS_HOST })
        const subClient = pubClient.duplicate()
        await Promise.all([
            pubClient.connect(),
            subClient.connect()
        ]);
        io.adapter(createAdapter(pubClient, subClient));
        return io
    }
    
    private startHttpServer(httpServer: http.Server): void {
        console.log(`Server has started with process ${process.pid}`)
        httpServer.listen(SERVER_PORT, () => {
            console.log('Server running on port ' + SERVER_PORT)
        })
    }
    private socketIOConnection(io: ServerSocketIO): void {
        
    }
}