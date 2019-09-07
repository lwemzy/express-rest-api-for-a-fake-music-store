const Album = require('../models').album;
const Artist = require('../models').artist;
const AlbumCollab = require('../models').albumCollab;

exports.createAlbum = async (req, res, next) => {
  try {
    const newAlbum = await Album.create(
      req.body,
      { w: 1 },
      { returning: true }
    );

    for (let item of req.body.artists) {
      const artist = await Artist.findByPk(item.id);
      console.log(artist);
      if (!artist) {
        return res.status(404).json({
          status: 'Fail',
          message: "Artist doesn't exist"
        });
      }

      const collabrationObject = {
        artistId: item.id,
        albumId: newAlbum.id
      };

      const newCollaboration = await AlbumCollab.create(
        collabrationObject,
        { w: 1 },
        { returning: true }
      );

      return res.status(201).json({
        status: 'success',
        data: {
          data: newCollaboration
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.allAlbums = async (req, res, next) => {
  try {
    const albums = await Album.findAll({
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

    res.status(200).json({
      status: 'Success',
      data: {
        data: albums
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.updateAlbums = async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id);
    // remove all artist associations
    const artists = await album.getArtists();
    album.removeArtists(artists);

    for (let item of req.body.artists) {
      const collabrationObject = {
        artistId: item.id,
        albumId: album.id
      };

      const newCollaboration = await AlbumCollab.create(
        collabrationObject,
        { w: 1 },
        { returning: true }
      );

      const updatedAlbum = await Album.update(req.body, {
        where: { id: req.params.id }
      });

      return res.status(202).json({
        status: 'success',
        data: {
          data: updatedAlbum
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    // get album from database
    const album = await Album.findByPk(req.params.id);
    // remove all artist associations
    const artists = await album.getArtists();
    album.removeArtists(artists);

    // delete album
    const deletedAlbum = await album.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(202).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: error
    });
  }
};
