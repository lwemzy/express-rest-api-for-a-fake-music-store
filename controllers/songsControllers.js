const { song, album, genre } = require('../models');
const Factory = require('./modelFactory');
const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');

// nested post end point
// allow nested routes

exports.setAlbumIds = catchAsync(async (req, res, next) => {
  // check if album exists
  const albumItem = await album.findByPk(req.params.albumId, {
    include: ['songs']
  });

  if (!albumItem) {
    return next(
      new globalErrorHandler(
        `There's is no album with id ${req.params.albumId}`,
        404
      )
    );
  }

  if (!req.body.albumId) req.body.albumId = req.params.albumId;
  // req.user comes from the protect middelware
  // if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.addSong = Factory.newItem(song);
exports.findSong = Factory.findItem(song, {
  attributes: ['id', 'albumId', 'title', 'artist', 'composer', 'year'],
  include: {
    model: genre,
    as: 'genre',
    attributes: ['id', 'type']
  }
});
exports.findAllSong = Factory.allItems(song, {
  attributes: ['id', 'albumId', 'title', 'artist', 'composer', 'year'],
  include: {
    model: genre,
    as: 'genre',
    attributes: ['type']
  }
});
exports.updateSong = Factory.updateItem(song);
exports.deleteSong = Factory.deleteItem(song);

// { where: { attributes: 'firstName,lastName,dob' },
//   attributes: [ 'firstName', 'lastName', 'dob' ] }
