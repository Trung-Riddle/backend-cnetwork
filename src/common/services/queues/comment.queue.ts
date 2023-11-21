import { BaseQueue } from '@root/common/services/queues/base.queue';
import { ICommentJob } from '#Comment/interfaces/comment.interface';
import { commentWorker } from '#Worker/comment.worker';

class CommentQueues extends BaseQueue {
  constructor() {
    super('comments');
    this.processJob('addCommentToDB', 5, commentWorker.addCommentToDB);
  }
  public addCommentJob(name: string, data: ICommentJob): void {
    this.addJob(name, data);
  }
}
export default new CommentQueues();
