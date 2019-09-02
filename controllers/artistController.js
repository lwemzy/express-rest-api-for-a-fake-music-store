const Artist = require('../models').artist;

exports.addArtist = async (req, res, next) => {
  try {
    const newArtist = await Artist.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: newArtist
      }
    });
  } catch (error) {
    res.status(201).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.findAllArtist = async (req, res, next) => {
  try {
    const allArtist = await Artist.findAll();
    res.status(200).json({
      status: 'success',
      data: {
        data: allArtist
      }
    });
  } catch (error) {
    res.status(201).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.updateArtist = async (req, res, next) => {
  try {
    const patchedArtist = await Artist.update(req.body, {
      where: { id: req.params.id }
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: patchedArtist
      }
    });
  } catch (error) {
    res.status(201).json({
      status: 'Fail',
      message: error
    });
  }
};

exports.deleteArtist = async (req, res, next) => {
  try {
    const deletedArtist = await Artist.destroy(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(201).json({
      status: 'Fail',
      message: error
    });
  }
};
