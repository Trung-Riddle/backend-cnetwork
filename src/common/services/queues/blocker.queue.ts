import { BaseQueue } from '@root/common/services/queues/base.queue';
import blockerWorker from '#Worker/blocker.worker';
import { IBlockedUserJobData } from '#Follower/interfaces/follwer.interface';

class BlockerUserQueue extends BaseQueue {
  constructor() {
    super('blockedUsers');
    this.processJob('addBlockedUserToDB', 5, blockerWorker.addBlockedUserToDB);
    this.processJob('removeBlockedUserFromDB', 5, blockerWorker.addBlockedUserToDB);
  }
  public addBlockedUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}
export default new BlockerUserQueue();
