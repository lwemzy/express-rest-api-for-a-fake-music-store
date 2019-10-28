const express = require('express');

const app = express.Router({ mergeParams: true });
const songsControllers = require('../controllers/songsControllers');
const songReviewRouter = require('./songReviewRoute');

// nested route
app.use('/:songId/reviews', songReviewRouter);

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
