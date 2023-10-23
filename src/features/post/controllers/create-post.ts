import { Request, Response } from 'express';
import { IPostDocument } from '#Post/interfaces/post.interface';
import { ObjectId } from 'mongodb';
export class Create {
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: '',
      imgId: '',
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 }
    } as IPostDocument;
  }
}
