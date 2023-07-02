import express, { Express } from 'express';
import { Lime8Server } from './setupServer';
import databaseConnection from './setupDatabase'
import { config } from './config';
class Application {
    public initialize(): void {
        this.loadConfig()
        databaseConnection()
        const app: Express = express()
        const server: Lime8Server = new Lime8Server(app)
        server.start()
    }
    private loadConfig(): void {
        config.validateConfig()
    }
}
const application = new Application()
application.initialize()