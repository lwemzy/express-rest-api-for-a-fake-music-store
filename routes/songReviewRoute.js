const express = require('express');

const app = express.Router({ mergeParams: true });
const songReview = require('../controllers/songReviewController');

// TODO
// add post route for creating reviews on songs

app
  .route('/')
  .post(songReview.addReview)
  .get(songReview.findAllReview);
app
  .route('/:id')
  .get(songReview.findReview)
  .patch(songReview.updateReview)
  .delete(songReview.deleteReview);

module.exports = app;
