const Artist = require('../models').artist;
const catchAsync = require('../utils/cathcAsyncHandler');
exports.addArtist = catchAsync(async (req, res, next) => {
  const newArtist = await Artist.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newArtist
    }
  });
});

exports.findAllArtist = catchAsync(async (req, res, next) => {
  const allArtist = await Artist.findAll();
  res.status(200).json({
    status: 'success',
    data: {
      data: allArtist
    }
  });
});

exports.updateArtist = catchAsync(async (req, res, next) => {
  const patchedArtist = await Artist.update(req.body, {
    where: { id: req.params.id }
  });

  res.status(202).json({
    status: 'success',
    data: {
      data: patchedArtist
    }
  });
});

exports.deleteArtist = catchAsync(async (req, res, next) => {
  const deletedArtist = await Artist.destroy(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});
