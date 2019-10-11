const { artist, album, albumCollab } = require('../models');
const Factory = require('./modelFactory');

exports.addArtist = Factory.newItem(artist);
exports.findArtist = Factory.findItem(artist, {
  include: {
    model: album,
    as: 'albums',
    required: false,
    through: {
      model: albumCollab,
      as: 'collabrations'
    }
  }
});
exports.findAllArtist = Factory.allItems(artist);
exports.updateArtist = Factory.updateItem(artist);
exports.deleteArtist = Factory.deleteItem(artist);
