import { userService } from '#Services/db/user.service';
import { UserCache } from '#Services/redis/user.cache';
import { IUserDocument } from '#User/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const userCache: UserCache = new UserCache();
const PAGE_SIZE = 10;

export class Get {
  public async users(req: Request, res: Response) {
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    let users: IUserDocument[] = [];
    let totalUsers = 0;
    const cachedUsers: IUserDocument[] = await userCache.getUsersFromCache(skip, newSkip, 'user');
    if (cachedUsers.length) {
      users = cachedUsers;
      totalUsers = await userCache.getTotalUsersInCache();
    } else {
      users = await userService.getAllUsers(req.currentUser!.userId, skip, limit);
      totalUsers = await userService.usersCount();
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Tất cả người dùng', users, totalUsers });
  }
}
