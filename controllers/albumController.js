const { albumCollab, artist, album, song } = require('../models');
const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');
const FileUpdload = require('../utils/fileUpdload');
const Factory = require('./modelFactory');

exports.uploadAlbumArt = FileUpdload.upload.single('albumArt');

exports.setArtistIds = catchAsync(async (req, res, next) => {
  // check if artist exists
  const Artist = await artist.findByPk(req.params.albumId);

  if (!Artist) {
    return next(
      new globalErrorHandler(
        `There's is no artist with id ${req.params.artistId}`,
        404
      )
    );
  }

  if (!req.body.artistId) req.body.artistId = req.params.artistId;
  // req.user comes from the protect middelware
  // if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.createAlbum = Factory.newManyToManyItem(album, artist, albumCollab, {
  artistId: 0,
  albumId: 0,
  bodyParam: 'artists'
});

exports.allAlbums = Factory.allItems(album, {
  include: {
    model: artist,
    as: 'artists',
    required: false,
    through: {
      model: albumCollab,
      as: 'collabrations'
    }
  }
});

exports.findAlbum = Factory.findItem(album, {
  include: [
    {
      model: song,
      as: 'songs',
      required: true
    },
    {
      model: artist,
      as: 'artists',
      required: false,
      through: {
        model: albumCollab,
        as: 'collabrations'
      }
    }
  ]
});

exports.updateAlbums = catchAsync(async (req, res, next) => {
  const Album = await album.findByPk(req.params.id);
  // remove all artist associations
  const Artists = await Album.getArtists();
  await Album.removeArtists(Artists);

  for (let item of req.body.artists) {
    const collabrationObject = {
      artistId: item.id,
      albumId: album.id
    };
    const newCollaboration = await albumCollab.create(collabrationObject);
    const updatedAlbum = await album.update(req.body, {
      where: { id: req.params.id }
    });
  }

  return res.status(202).json({
    status: 'success',
    data: {
      data: Album
    }
  });
});

exports.deleteAlbum = catchAsync(async (req, res, next) => {
  // get album from database
  const Album = await album.findByPk(req.params.id);
  // remove all artist associations
  const Artists = await Album.getArtists();
  await Album.removeArtists(Artists);

  // delete album
  const deletedAlbum = await Album.destroy({
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
