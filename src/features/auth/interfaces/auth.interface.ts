import { Document } from 'mongoose';
import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}
export interface AuthPayload {
  userId: string
  uId: string
  email: string
  username: string
  avatarColor: string
  avatarImage?: string
  iat?: number
}
export interface IAuthDocument extends Document {
  _id: string | ObjectId
  uId: string
  email: string
  username: string
  password?: string
  avatarColor: string
  avatarImage?: string
  createAt: Date
  comparePassword(password: string): Promise<boolean>
  hashPassWord(password: string): Promise<boolean>
}
export interface ISignUpData {
  _id: ObjectId
  uId: string
  email: string
  username: string
  password: string
  avatarColor: string
  avatarImage?: string
}
export interface IAuthJob {
  value?: string | IAuthDocument
}
