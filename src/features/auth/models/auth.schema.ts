import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { model, Model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number },
    createAt: { type: Date, default: Date.now() }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);
// đăng ký một middleware trước khi một hành động cụ thể được thực hiện trên một tài liệu
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});
// định nghĩa 1 phương thức
authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashedPassword);
};
authSchema.methods.hashPassWord = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};
export const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
