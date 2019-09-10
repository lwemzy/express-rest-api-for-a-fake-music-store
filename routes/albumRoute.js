const express = require('express');
const app = express();

const albumController = require('../controllers/albumController');

app
  .route('/')
  .post(albumController.createAlbum)
  .get(albumController.allAlbums);
app
  .route('/:id')
  .get(albumController.findAlbum)
  .patch(albumController.updateAlbums)
  .delete(albumController.deleteAlbum);

module.exports = app;
