const Review = require('../models').songreview;
const Factory = require('./modelFactory');

exports.addReview = Factory.newItem(Review);
exports.findReview = Factory.findItem(Review);
exports.findAllReview = Factory.allItems(Review);
exports.updateReview = Factory.updateItem(Review);
exports.deleteReview = Factory.deleteItem(Review);
