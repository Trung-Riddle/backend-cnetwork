import { IUserDocument } from './../interfaces/user.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true },
  fullName: { type: String, default: '' },
  birthday: { type: Date },
  profilePicture: { type: String, default: '' },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  passwordResetToken: { type: String, default: '' },
  passwordResetExpires: { type: Number },
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  relatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: {
    messages: { type: Boolean, default: true },
    reactions: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  social: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    github: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  work: { type: String, default: '' },
  school: { type: String, default: '' },
  location: { type: String, default: '' },
  quote: { type: String, default: '' },
  bgImageCover: { type: String, default: '' },
  bgImageId: { type: String, default: '' },
  status: { type: Boolean, default: true }
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
