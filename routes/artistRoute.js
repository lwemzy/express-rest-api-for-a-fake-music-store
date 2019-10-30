const express = require('express');

const app = express.Router();
const artistController = require('../controllers/artistController');

app
  .route('/')
  .post(artistController.addArtist)
  .get(artistController.findAllArtist);
app
  .route('/:id')
  .get(artistController.findArtist)
  .patch(artistController.updateArtist)
  .delete(artistController.deleteArtist);

module.exports = app;
