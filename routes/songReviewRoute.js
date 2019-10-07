const express = require('express');
const songReview = require('../controllers/songReviewController');
const app = express();

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
