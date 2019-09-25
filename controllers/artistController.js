const Artist = require('../models').artist;
const catchAsync = require('../utils/cathcAsyncHandler');
const Factory = require('./modelFactory');

exports.addArtist = Factory.newItem(Artist);
exports.findArtist = Factory.findItem(Artist);
exports.findAllArtist = Factory.allItems(Artist);
exports.updateArtist = Factory.updateItem(Artist);
exports.deleteArtist = Factory.deleteItem(Artist);
