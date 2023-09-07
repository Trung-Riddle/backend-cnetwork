import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export function uploads(
  file: string,
  public_id: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file, {
      public_id,
      overwrite,
      invalidate
    }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
      if (error) resolve(error);
      resolve(result);
    });
  });
}
export function uploadMultiple(
  files: string[],
  public_ids: string[],
  overwrite?: boolean,
  invalidate?: boolean
): Promise<(UploadApiResponse | UploadApiErrorResponse)[] | undefined> {
  const uploadPromises: Promise<UploadApiResponse | UploadApiErrorResponse>[] = [];

  files.forEach((file, index) => {
    const public_id = public_ids[index];
    const uploadPromise = new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve) => {
      cloudinary.v2.uploader.upload(file, {
        public_id,
        overwrite,
        invalidate
      }, (error: UploadApiErrorResponse | undefined, result: any) => {
        if (error) resolve(error);
        resolve(result);
      });
    });
    uploadPromises.push(uploadPromise);
  });

  return Promise.all(uploadPromises);
}
