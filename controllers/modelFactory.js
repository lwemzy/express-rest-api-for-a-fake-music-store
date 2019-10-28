const { Op } = require('sequelize');
const catchAsync = require('../utils/cathcAsyncHandler');
const GlobalErrorHandler = require('../utils/globalErrorHandler');

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
    if (req.params.albumId) {
      querryParams.where = { albumId: req.params.albumId, ...querryObj };
    } else if (req.params.songId) {
      querryParams.where = { songId: req.params.songId, ...querryObj };
    } else {
      Object.assign(querryParams.where, querryObj);
    }

    // console.log(querryParams);

    // sequelize advanced search filter
    // for gt gte lt lte
    // { where: { id: { [Op.gt]: 2 } } }
    // where: { id: { [Op.gte]: '2', [Op.lt]: '5' } }

    Object.keys(querryObj).forEach(el => {
      // TODO
      // Refactor to function
      // copy query object
      const OBJ = Object.values(querryObj[el]);
      if (typeof querryObj[el] === 'object') {
        Object.keys(querryObj[el]).forEach((val, index) => {
          if (val === 'gt') {
            delete querryObj[el].gt;
            Object.assign(querryObj[el], { [Op.gt]: OBJ[index] });
          } else if (val === 'gte') {
            delete querryObj[el].gte;
            Object.assign(querryObj[el], { [Op.gte]: OBJ[index] });
          } else if (val === 'lt') {
            delete querryObj[el].lt;
            Object.assign(querryObj[el], { [Op.lt]: OBJ[index] });
          } else if (val === 'lte') {
            delete querryObj[el].lte;
            Object.assign(querryObj[el], { [Op.lte]: OBJ[index] });
          }
        });
      }
    });

    Object.assign(querryParams.where, querryObj);

    // querryParams.where = querryObj;

    // sorting
    // ?order[]=firstName&order[]=DESC
    if (req.query.order) {
      querryParams.order = [[...req.query.order]];
    } else {
      querryParams.order = [['createdAt', 'DESC']];
    }

    // field limiting
    if (req.query.fields) {
      const fieldArray = req.query.fields.split(',');
      querryParams.attributes = fieldArray;
    }

    // pagination
    if (req.query.limit && req.query.page) {
      const limit = req.query.limit * 1 || 1;
      const page = req.query.page * 1 || 10;
      const offset = (page - 1) * limit;
      querryParams = { ...querryParams, offset, limit };
    }

    const Items = await model.findAndCountAll({
      ...querryParams
    });

    // if (!!!Items.rows.length) {
    //   return next(new GlobalErrorHandler(`💥 page doesn't exist`, 404));
    // }

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
