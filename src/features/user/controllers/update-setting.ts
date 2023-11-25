import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import userQueue from '#Services/queues/user.queue';
import { UserCache } from '#Services/redis/user.cache';
import { notificationSettingsSchema } from '#User/schemas/info';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const userCache: UserCache = new UserCache();

export class UpdateSettings {
  @joiValidation(notificationSettingsSchema)
  public async notification(req: Request, res: Response): Promise<void> {
    await userCache.updateSingleUserItemInCache(`${req.currentUser!.userId}`, 'notifications', req.body);
    userQueue.addUserJob('updateNotificationSettings', {
      key: `${req.currentUser!.userId}`,
      value: req.body
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification settings updated successfully', settings: req.body });
  }
}
