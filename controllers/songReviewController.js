const { songreview } = require('../models');
const Factory = require('./modelFactory');

exports.addReview = Factory.newItem(songreview);
exports.findReview = Factory.findItem(songreview);
exports.findAllReview = Factory.allItems(songreview);
exports.updateReview = Factory.updateItem(songreview);
exports.deleteReview = Factory.deleteItem(songreview);
