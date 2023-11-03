import { BaseQueue } from '@root/common/services/queues/base.queue';
import { IEmailJob } from '#User/interfaces/user.interface';
import authWorker from '@root/common/workers/auth.worker';
import emailWorker from '#Worker/email.worker';

class EmailQueue extends BaseQueue {
  constructor() {
    super('emails');
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail);
    this.processJob('directMessageEmail', 5, emailWorker.addNotificationEmail);
  }
  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}
export default new EmailQueue();
