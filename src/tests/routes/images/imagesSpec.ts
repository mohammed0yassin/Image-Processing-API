import supertest from 'supertest';
import app from '../../../index';
import { promises as fs } from 'fs';
import path from 'path';
import { exitCode } from 'process';

const request = supertest(app);
describe('Test Images endpoint responses', () => {
  it('gets and resizes the image', async () => {
    const response = await request.get(
      '/api/images?filename=test.jpg&width=400&height=400'
    );
    const resizedImage = await fs.readFile(
      path.join(process.cwd(), '/full/test.jpg')
    );
    expect(response.status).toBe(200);
    expect(resizedImage).toBeTruthy();
  });
  it('throws an error if image is not found', async () => {
    const response = await request.get(
      '/api/images?filename=notafile.jpg&width=400&height=400'
    );
    expect(response.status).toBe(200);
    expect(response.text).toContain('Image notafile.jpg does not exist');
    await expectAsync(
      fs.readFile(path.join(process.cwd(), '/full/notafile.jpg'))
    ).not.toBeResolved();
  });
});
