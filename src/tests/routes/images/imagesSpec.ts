import supertest from 'supertest';
import app from '../../../index';
import { promises as fs } from 'fs';
import path from 'path';

const request = supertest(app);

describe('Test Images endpoint responses', () => {
  const testImage = 'test.jpg';
  const resizedImagePath = path.join(process.cwd(), `/full/${testImage}`);
  const testNoImage = 'notafile.jpg';
  
  it('gets and resizes the image', async () => {
    const response = await request.get(
      `/api/images?filename=${testImage}&width=400&height=400`
    );
    const resizedImage = await fs.readFile(resizedImagePath);
    expect(response.status).toBe(200);
    expect(resizedImage).toBeTruthy();
  });

  it('throws an error if image is not found', async () => {
    const response = await request.get(
      `/api/images?filename=${testNoImage}&width=400&height=400`
    );
    expect(response.status).toBe(200);
    expect(response.text).toContain(`Image ${testNoImage} does not exist`);
    await expectAsync(
      fs.readFile(path.join(process.cwd(), `/full/${testNoImage}`))
    ).not.toBeResolved();
  });

  afterAll(async () => {
    // delete the resized test image
    await fs.unlink(path.join(process.cwd(), `/thumb/${testImage}`));
  });
});
