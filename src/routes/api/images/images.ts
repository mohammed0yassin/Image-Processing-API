import express from 'express';
import path from 'path';

const sharp = require('sharp');

const images = express.Router();


const imageExists = async (imageThumbnail: string, width: number, height: number): Promise<boolean> => { 
  const metadata = await sharp(imageThumbnail).metadata();
  return metadata.width == width && metadata.height == height 
};


images.get('/', async (req, res) => {
  // Get image and thumbnail details
  const imagePath = path.join(process.cwd(), '/full/' , (req.query.filename as unknown) as string);
  const width = parseInt((req.query.width as unknown) as string);
  const height = parseInt((req.query.height as unknown) as string);
  const imageThumbnail = path.join(process.cwd(), '/thumb/' , (req.query.filename as unknown) as string);
  // Check if imageThumbnail exists
  const imageExist = await imageExists(imageThumbnail, width, height);
  if (imageExist) {
    console.log(`Image ${req.query.filename} already exists`)
    res.sendFile(imageThumbnail);
  }
  else {
    const resizedImage = await sharp(imagePath).resize(width, height).toFile(imageThumbnail);
    console.log(`Image ${req.query.filename} resized`)
    res.sendFile(imageThumbnail);
  }
});

export default images;