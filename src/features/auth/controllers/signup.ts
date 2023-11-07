import HTTP_STATUS from 'http-status-codes';
import { IUserDocument } from '#User/interfaces/user.interface';
import { ObjectId } from 'mongodb';
import { Response, Request } from 'express';
import { joiValidation } from '@root/common/global/decorators/joi-validation.decorator';
import { signupSchema } from '#Auth/schemas/signup';
import { IAuthDocument, ISignUpData } from '#Auth/interfaces/auth.interface';
import { authService } from '@root/common/services/db/auth.service';
import { BadRequestError } from '@root/common/global/helpers/errorHandler';
import { Helper } from '@root/common/global/helpers/helper';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@root/common/global/helpers/cloudinary-upload';
import { UserCache } from '@root/common/services/redis/user.cache';
import { config } from '@root/config';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';
import authQueue from '@root/common/services/queues/auth.queue';
import userQueue from '@root/common/services/queues/user.queue';

const userCache: UserCache = new UserCache();
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
    // add to redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUDINARY_CLOUD_NAME}/image/upload/v${result.version}/${userObjId}`;
    await userCache.saveUserToCache(`${userObjId}`, uId, userDataForCache);

    // add to database
    // omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
    authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
    userQueue.addUserJob('addUserToDB', { value: userDataForCache });

    const userJWT: string = SignUp.prototype.signToken(authData, userObjId);

    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.CREATED).json({ message: 'User created Successfully', user: userDataForCache, token: userJWT });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
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
  private userData(data: IAuthDocument, userObjecId: ObjectId): IUserDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id: userObjecId,
      authId: _id,
      uId,
      username: Helper.firstLetterUppercase(username),
      email,
      fullName: '',
      birthday: '',
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      relatives: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageCover: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        github: '',
        youtube: ''
      },
      status: true
    } as unknown as IUserDocument;
  }
}
