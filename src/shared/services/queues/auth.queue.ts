import { IAuthJob } from '#Auth/interfaces/auth.interface';
import { BaseQueue } from '#Services/queues/base.queue';
import authWorker from '#Worker/auth.worker';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }
  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}
export default new AuthQueue();
