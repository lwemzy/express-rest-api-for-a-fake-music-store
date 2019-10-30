const catchAsync = require('../utils/cathcAsyncHandler');
const GlobalErrorHandler = require('../utils/globalErrorHandler');
const {
  AdvancedSerch,
  Sort,
  PagePaginate,
  FieldLimiting
} = require('../utils/apiFeatures');
const { song } = require('../models');

const mapManyToMany = async obj => {
  const { item, model, throughModel, model2, options, newItem, next } = {
    ...obj
  };
  const artist = await model2.findByPk(item.id);
  if (!artist) {
    await model.destroy({ where: { id: newItem.id } });
    return next(new GlobalErrorHandler(`Artist doesnt exist`, 404));
  }

  const keys = Object.keys(options);
  options[keys[0]] = item.id;
  options[keys[1]] = newItem.id;

  delete options.bodyParam;
  const linkData = await throughModel.create(options);
  if (!linkData) {
    await model.destroy({ where: { id: newItem.id } });
    return next(
      new GlobalErrorHandler(`Failed to create collaboration data`, 406)
    );
  }
};

exports.newItem = model =>
  catchAsync(async (req, res, next) => {
    const newData = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newData
      }
    });
  });

exports.newManyToManyItem = (model, model2, throughModel, options) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.albumArt = req.file.filename;

    const newItem = await model.create(req.body);

    if (newItem) {
      req.body[options.bodyParam].map(item =>
        mapManyToMany({
          item,
          model,
          throughModel,
          model2,
          options,
          newItem,
          next
        })
      );
    }

    return res.status(201).json({
      status: 'success',
      data: {
        data: newItem
      }
    });
  });

exports.findItem = (model, options = {}) =>
  catchAsync(async (req, res, next) => {
    // TODO
    // Work on Nested Item Bug
    // check is req.params has albumId
    // check if song with that id exists

    const item = await model.findByPk(req.params.id, options);
    if (!item) {
      return next(new GlobalErrorHandler(`No Item found`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: item
      }
    });
  });

exports.allItems = (model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let querryParams = { ...options };
    const querryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields', 'order'];
    excludedFields.forEach(el => delete querryObj[el]);

    // let querryString = JSON.stringify(querryObj);
    // querryString = querryString.replace(
    //   /\b(gte|lt|lte|gt)\b/g,
    //   match => `$${match}`
    // );
    // const filter = JSON.parse(querryString);

    // implementing nested routing

    if (Object.keys(req.params).length < 2) {
      if (req.params.albumId) {
        querryParams.where = { albumId: req.params.albumId, ...querryObj };
      } else if (req.params.songId) {
        querryParams.where = { songId: req.params.songId, ...querryObj };
      } else {
        querryParams.where = querryObj;
      }
    } else {
      // if (req.params.albumId) {
      // TODO
      // check if album exists

      // console.log(req.params);

      const item = await song.findAll({
        where: { albumId: req.params.albumId }
      });
      if (item) {
        querryParams.where = { songId: req.params.songId, ...querryObj };
      } else {
        return next(new GlobalErrorHandler('Album Not Found', 404));
      }
    }

    // sequelize advanced search filter
    // for gt gte lt lte
    // { where: { id: { [Op.gt]: 2 } } }
    // where: { id: { [Op.gte]: '2', [Op.lt]: '5' } }
    // ?id[lt]=5
    AdvancedSerch({ querryObj, querryParams });

    // sorting
    // ?order[]=firstName&order[]=DESC
    // field limiting
    // ?fields=firstName,id
    // pagination
    // ?limit=3&page=1
    querryParams = PagePaginate(FieldLimiting(Sort({ querryParams, req })));

    // console.log(querryParams);

    const Items = await model.findAndCountAll({
      ...querryParams
    });

    if (!Items.rows.length) {
      return next(new GlobalErrorHandler(`💥 page doesn't exist`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: Items
      }
    });
  });

exports.updateItem = model =>
  catchAsync(async (req, res, next) => {
    const patchedItem = await model.update(req.body, {
      where: { id: req.params.id }
    });

    res.status(202).json({
      status: 'success',
      data: {
        data: patchedItem
      }
    });
  });

exports.deleteItem = model =>
  catchAsync(async (req, res, next) => {
    const deletedItem = await model.destroy({ where: { id: req.params.id } });
    if (!deletedItem) {
      return next(new GlobalErrorHandler(`No Item found with that id`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
