import express, { Express } from 'express';
import { Lime8Server } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: Lime8Server = new Lime8Server(app);
    server.start();
  }
  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}
const application = new Application();
application.initialize();
