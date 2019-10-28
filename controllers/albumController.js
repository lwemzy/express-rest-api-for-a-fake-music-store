const { albumCollab, artist, album, song } = require('../models');
const catchAsync = require('../utils/cathcAsyncHandler');
const GlobalErrorHandler = require('../utils/globalErrorHandler');
const FileUpdload = require('../utils/fileUpdload');
const Factory = require('./modelFactory');

// File Upload
exports.uploadAlbumArt = FileUpdload.upload.single('albumArt');

exports.setArtistIds = catchAsync(async (req, res, next) => {
  // check if artist exists
  const Artist = await artist.findByPk(req.params.albumId);

  if (!Artist) {
    return next(
      new GlobalErrorHandler(
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

const collabUpdate = async (item, Album) => {
  // if its a new collabrating artist create one
  //  await albumCollab.findOrCreate({
  //   where: { artistId: item.id, albumId: Album.id }
  // });

  // // else update existing artist
  // await albumCollab.update(
  //   {
  //     ...Album,
  //     artistId: item.id,
  //     albumId: Album.id
  //   },
  //   {
  //     ...Album,
  //     where: {
  //       artistId: item.id,
  //       albumId: Album.id
  //     }
  //   }
  // );
  await albumCollab.create({
    ...Album,
    artistId: item.id,
    albumId: Album.id
  });
};

exports.updateAlbums = catchAsync(async (req, res, next) => {
  const Album = await album.findByPk(req.params.id);
  // remove all artist associations
  const Artists = await Album.getArtists();
  await Album.removeArtists(Artists);

  req.body.artists.map(item => collabUpdate(item, Album));

  await album.update(req.body, {
    where: { id: req.params.id }
  });

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
  if (Artists) await Album.removeArtists(Artists);

  // delete album
  if (Album) {
    const deletedAlbum = await Album.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deletedAlbum) {
      return next(new GlobalErrorHandler(`No Album with that id`, 404));
    }
  }

  res.status(202).json({
    status: 'success',
    data: null
  });
});
