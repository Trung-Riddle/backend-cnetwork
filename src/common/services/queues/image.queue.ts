import { IFileImageJobData } from '#Image/interfaces/image.interface';
import { BaseQueue } from '#Services/queues/base.queue';
import { imageWorker } from '#Worker/image.worker';

class ImageQueue extends BaseQueue {
  constructor() {
    super('images');
    this.processJob('addUserProfileImageToDB', 5, imageWorker.addUserProfileImageToDB);
    this.processJob('updateBGImageInDB', 5, imageWorker.updateBGImageInDB);
    this.processJob('addImageToDB', 5, imageWorker.addImageToDB);
    this.processJob('removeImageFromDB', 5, imageWorker.removeImageFromDB);
  }
  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}
export default new ImageQueue();
