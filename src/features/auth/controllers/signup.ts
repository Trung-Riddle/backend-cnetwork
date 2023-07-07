import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { Response, Request } from 'express';
import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { signupSchema } from '#Auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '#Auth/interfaces/auth.interface';
import { authService } from '#Services/db/auth.service';
import { BadRequestError } from '#Global/helpers/errorHandler';
import { Helper } from '#Global/helpers/helper';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '#Global/helpers/cloudinary-upload';

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials');
    }
    const authObjId: ObjectId = new ObjectId();
    const userObjId: ObjectId = new ObjectId();
    const uId = `${Helper.generateRandomIntergers(12)}`;
    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjId,
      uId,
      username,
      email,
      password,
      avatarColor
    });
    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjId}`, true, true)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File Upload: Invalid credentials. Try again!');
    }
    res.status(HTTP_STATUS.CREATED).json({ message: 'User created Successfully', authData });
  }
  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helper.firstLetterUppercase(username),
      email: Helper.lowerCase(email),
      password,
      avatarColor,
      createAt: new Date()
    } as IAuthDocument;
  }
}
