const Album = require('../models').album;
const Artist = require('../models').artist;
const AlbumCollab = require('../models').albumCollab;
const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');
const Factory = require('./modelFactory');

exports.createAlbum = Factory.newManyToManyItem(Album, Artist, AlbumCollab, {
  artistId: 0,
  albumId: 0,
  bodyParam: 'artists'
});

exports.allAlbums = Factory.allItems(Album, {
  include: {
    model: Artist,
    as: 'artists',
    required: false,
    through: {
      model: AlbumCollab,
      as: 'collabrations'
    }
  }
});

exports.findAlbum = Factory.findItem(Album, {
  include: {
    model: Artist,
    as: 'artists',
    required: false,
    through: {
      model: AlbumCollab,
      as: 'collabrations'
    }
  }
});

exports.updateAlbums = catchAsync(async (req, res, next) => {
  const album = await Album.findByPk(req.params.id);
  // remove all artist associations
  const artists = await album.getArtists();
  await album.removeArtists(artists);

  for (let item of req.body.artists) {
    const collabrationObject = {
      artistId: item.id,
      albumId: album.id
    };
    const newCollaboration = await AlbumCollab.create(collabrationObject);
    const updatedAlbum = await Album.update(req.body, {
      where: { id: req.params.id }
    });
  }

  return res.status(202).json({
    status: 'success',
    data: {
      data: album
    }
  });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
  // get album from database
  const album = await Album.findByPk(req.params.id);
  // remove all artist associations
  const artists = await album.getArtists();
  await album.removeArtists(artists);

  // delete album
  const deletedAlbum = await album.destroy({
    where: {
      id: req.params.id
    }
  });

  if (!deletedAlbum) {
    return next(new globalErrorHandler(`No Album with that id`, 404));
  }

  res.status(202).json({
    status: 'success',
    data: null
  });
});
