import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '#User/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}
export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}
export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  email: string;
  username: string;
  password?: string;
  avatarColor: string;
  createAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  comparePassword(password: string): Promise<boolean>;
  hashPassWord(password: string): Promise<string>;
}
export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}
export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
