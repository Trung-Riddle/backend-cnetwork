import { BaseQueue } from '@root/common/services/queues/base.queue';
import { IFollowerJobData } from '#Follower/interfaces/follwer.interface';
import followerWorker from '#Worker/follower.worker';

class ChatQueue extends BaseQueue {
  constructor() {
    super('followers');
    this.processJob('addFollowerToDB', 5, followerWorker.addFollowerToDB);
    this.processJob('removeFollowerFromDB', 5, followerWorker.removeFollowerFromDB);
  }
  public addFollowerJob(name: string, data: IFollowerJobData): void {
    this.addJob(name, data);
  }
}
export default new ChatQueue();
