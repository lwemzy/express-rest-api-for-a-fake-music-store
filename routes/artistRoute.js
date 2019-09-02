const express = require('express');
const artistController = require('../controllers/artistController');
const app = express();

app
  .route('/')
  .post(artistController.addArtist)
  .get(artistController.findAllArtist);
app
  .route('/:id')
  .patch(artistController.updateArtist)
  .delete(artistController.deleteArtist);

module.exports = app;
