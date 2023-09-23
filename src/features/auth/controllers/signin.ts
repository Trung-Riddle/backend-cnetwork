import { Response, Request } from 'express';
import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { authService } from '#Services/db/auth.service';
import { BadRequestError } from '#Global/helpers/errorHandler';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { loginSchema } from '#Auth/schemes/signin';
import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { IUserDocument } from '#User/interfaces/user.interface';
import { userService } from '#Services/db/user.service';
export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('wrong password');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    const userJWT: string = JWT.sign({
      userId: user._id,
      uId: existingUser.uId,
      email: existingUser.email,
      username: existingUser.username,
      avatarColor: existingUser.avatarColor
    }, config.JWT_TOKEN!);
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser.createAt,
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'User login Successfully', user: userDocument, token: userJWT });
  }
}
