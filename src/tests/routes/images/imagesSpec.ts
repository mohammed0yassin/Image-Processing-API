import supertest from 'supertest';
import app from '../../../index';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const request = supertest(app);

describe('Test Images endpoint responses', () => {
  const testImage = 'test.jpg';
  const resizedImagePath = path.join(process.cwd(), `/thumb/${testImage}`);
  const testNoImage = 'notafile.jpg';

  beforeEach(async () => {
    try {
      await fs.readFile(resizedImagePath);
      await fs.unlink(path.join(process.cwd(), `/thumb/${testImage}`));
    } catch {
      // pass
    }
  });

  it('gets and resizes the image', async () => {
    const response = await request.get(
      `/api/images?filename=${testImage}&width=400&height=400`
    );
    const resizedImage = await fs.readFile(resizedImagePath);
    expect(response.status).toBe(200);
    expect(resizedImage).toBeTruthy();
  });

  it('makes sure a new image is created and processed', async () => {
    const width = 400;
    const height = 400;
    const response = await request.get(
      `/api/images?filename=${testImage}&width=${width}&height=${height}`
    );

    const resizedImage = await sharp(resizedImagePath).metadata();
    expect(response.status).toBe(200);
    expect(resizedImage).toBeTruthy();
    expect(resizedImage.width).toEqual(width);
    expect(resizedImage.height).toEqual(height);
  });

  it('throws an error if image is not found', async () => {
    const response = await request.get(
      `/api/images?filename=${testNoImage}&width=400&height=400`
    );
    expect(response.status).toBe(200);
    expect(response.text).toContain(`Image ${testNoImage} does not exist`);
    await expectAsync(fs.readFile(resizedImagePath)).not.toBeResolved();
  });

  afterAll(async () => {
    // delete the resized test image
    try {
      await fs.unlink(path.join(process.cwd(), `/thumb/${testImage}`));
    } catch (err) {
      // pass
    }
  });
});
