import express from 'express';
import images from './api/images/images';
const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Main API Route');
});

routes.use('/images', images);

export default routes;
