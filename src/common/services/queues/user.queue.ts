import { BaseQueue } from '@root/common/services/queues/base.queue';
import userWorker from '@root/common/workers/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
    this.processJob('updateSocialLinksInDB', 5, userWorker.updateSocialLinks);
    this.processJob('updateBasicInfoInDB', 5, userWorker.updateUserInfo);
    this.processJob('updateNotificationSettings', 5, userWorker.updateNotificationSettings);
  }
  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}
export default new UserQueue();
