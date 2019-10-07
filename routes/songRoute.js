const express = require('express');
const songsControllers = require('../controllers/songsControllers');
const app = express.Router({ mergeParams: true });

app
  .route('/')
  .post(songsControllers.setAlbumIds, songsControllers.addSong)
  .get(songsControllers.findAllSong);
app
  .route('/:id')
  .get(songsControllers.findSong)
  .patch(songsControllers.updateSong)
  .delete(songsControllers.deleteSong);

module.exports = app;
