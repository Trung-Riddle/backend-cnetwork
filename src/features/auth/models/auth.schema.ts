import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { model, Model, Schema } from 'mongoose';
import {hash, compare} from 'bcryptjs';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createAt: { type: Date, default: Date.now() },
  }
);
