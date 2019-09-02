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
        return res.status(400).json({
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

      return res.status(200).json({
        status: 'succesc',
        data: {
          data: newCollaboration
        }
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 'Fail',
      message: error
    });
  }
};
