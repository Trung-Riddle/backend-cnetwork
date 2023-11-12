import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '#Auth/interfaces/auth.interface';
import { IEmailJob } from '#User/interfaces/user.interface';
import { IPostJobData } from '#Post/interfaces/post.interface';
import { IChatJobData, IMessageData } from '#Chat/interfaces/chat.interface';
import { IFollowerJobData } from '#Follower/interfaces/follwer.interface';
import { IReactionJob } from '#Reaction/interfaces/reaction.interface';
import { ICommentJob } from '#Comment/interfaces/comment.interface';
import { INotificationJobData } from '#Notification/interfaces/notification.interface';

type IBaseJobData = IAuthJob | IEmailJob | IPostJobData | IChatJobData | IMessageData | IFollowerJobData | IReactionJob | ICommentJob | INotificationJobData;
let bullAdapter: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapter.push(new BullAdapter(this.queue));
    bullAdapter = [...new Set(bullAdapter)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapter,
      serverAdapter
    });
    this.log = config.createLogger(`${queueName}Queue`);
    this.queue.on('completed', (job: Job) => {
      job.remove();
    });
    this.queue.on('global:completed', (jobId: Job) => {
      this.log.info(`Job ${jobId} completed`);
    });
    //  là một sự kiện được kích hoạt khi một công việc toàn cục bị trì hoãn (stalled) trong hàng đợi
    this.queue.on('global:stalled', (jobId: Job) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }
  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }
  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
