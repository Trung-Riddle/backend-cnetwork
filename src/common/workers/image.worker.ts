import { IFileImageJobData } from '#Image/interfaces/image.interface';
import { BaseQueue } from '#Services/queues/base.queue';

class ImageQueue extends BaseQueue {
  constructor() {
    super('images');
  }
  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}
export default new ImageQueue();
