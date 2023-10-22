import { Response, Request } from 'express';
import { joiValidation } from '@root/common/global/decorators/joi-validation.decorator';
import { authService } from '@root/common/services/db/auth.service';
import { BadRequestError } from '@root/common/global/helpers/errorHandler';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { loginSchema } from '#Auth/schemas/signin';
import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { IUserDocument } from '#User/interfaces/user.interface';
import { userService } from '@root/common/services/db/user.service';
export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Thông tin không hợp lệ');
    }
    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Sai mật khẩu');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    const userJWT: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser.createAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'Đăng nhập thành công', user: userDocument, token: userJWT });
  }
}
