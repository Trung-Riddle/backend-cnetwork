import { IPostJobData } from '#Post/interfaces/post.interface';
import postWorker from '#Worker/post.worker';
import { BaseQueue } from '@root/common/services/queues/base.queue';

class PostQueue extends BaseQueue {
  constructor() {
    super('posts');
    this.processJob('addPostToDB', 5, postWorker.addPostToDB);
    this.processJob('deletePostFromDB', 5, postWorker.deletePostFromDB);
    this.processJob('updatePostInDB', 5, postWorker.updatePostInDB);
  }
  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}
export default new PostQueue();
