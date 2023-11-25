import { IFileImageDocument } from '#Image/interfaces/image.interface';
import { imageService } from '#Services/db/image.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Get {
  public async images(req: Request, res: Response): Promise<void> {
    const images: IFileImageDocument[] = await imageService.getImages(req.params.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User images', images });
  }
}
