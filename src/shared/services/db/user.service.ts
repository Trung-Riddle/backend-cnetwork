import { Helper } from '#Global/helpers/helper';
import { IUserDocument } from '#User/interfaces/user.interface';
import { UserModel } from '#User/models/user.schema';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
}

export const userService: UserService = new UserService();
