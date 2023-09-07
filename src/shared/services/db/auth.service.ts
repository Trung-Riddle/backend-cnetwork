import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { AuthModel } from '#Auth/models/auth.schema';
import { Helper } from '#Global/helpers/helper';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        { username: Helper.firstLetterUppercase(username) },
        { email: Helper.lowerCase(email) }
      ]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
