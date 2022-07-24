import express from 'express';
import path from 'path';
import sharp from 'sharp';

const images = express.Router();

const imageExists = async (
  imageThumbnail: string,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    const metadata = await sharp(imageThumbnail).metadata();
    return metadata.width == width && metadata.height == height;
  } catch (err) {
    return false;
  }
};

images.get(
  '/',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      // Get image and thumbnail details
      const imagePath = path.join(
        process.cwd(),
        '/full/',
        req.query.filename as unknown as string
      );
      const width = parseInt(req.query.width as unknown as string);
      const height = parseInt(req.query.height as unknown as string);
      const imageThumbnail = path.join(
        process.cwd(),
        '/thumb/',
        req.query.filename as unknown as string
      );
      // Check if imageThumbnail exists
      const imageExist = await imageExists(imageThumbnail, width, height);
      if (imageExist) {
        console.log(
          `Image ${req.query.filename as unknown as string} already exists`
        );
        res.sendFile(imageThumbnail);
      }
      // Else create new thumbnail
      else {
        await sharp(imagePath).resize(width, height).toFile(imageThumbnail);
        console.log(`Image ${req.query.filename as unknown as string} resized`);
        res.sendFile(imageThumbnail);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
        res.send(
          `Image ${req.query.filename as unknown as string} does not exist`
        );
      } else {
        console.log('Unexpected error', err);
      }
    }
  }
);

export default images;
