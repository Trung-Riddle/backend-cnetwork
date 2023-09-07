import { BaseQueue } from '#Services/queues/base.queue';
import userWorker from '#Worker/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }
  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}
export default new UserQueue();
