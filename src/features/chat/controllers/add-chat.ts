import { UserCache } from '#Services/redis/user.cache';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const userCache: UserCache = new UserCache();
const messageCache: MessageCache = new MessageCache();

export class AddChat {

}
