const express = require('express');
const app = express();

const albumController = require('../controllers/albumController');
const authController = require('../controllers/authController');

app
  .route('/')
  .post(
    authController.protect,
    albumController.uploadAlbumArt,
    albumController.createAlbum
  )
  .get(authController.protect, albumController.allAlbums);
app
  .route('/:id')
  .get(albumController.findAlbum)
  .patch(albumController.updateAlbums)
  .delete(albumController.deleteAlbum);

module.exports = app;
