const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');

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
    const newItem = await model.create(req.body);

    for (let item of req.body[options.bodyParam]) {
      const artist = await model2.findByPk(item.id);
      if (!artist) {
        await model.destroy({ where: { id: newItem.id } });
        return next(new globalErrorHandler(`Artist doesnt exist`, 404));
      }

      const keys = Object.keys(options);
      options[keys[0]] = item.id;
      options[keys[1]] = newItem.id;

      delete options.bodyParam;
      const linkData = await throughModel.create(options);
      if (!linkData) {
        await model.destroy({ where: { id: newItem.id } });
        return next(
          new globalErrorHandler(`Failed to create collaboration data`, 406)
        );
      }
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
      return next(new globalErrorHandler(`No Item found`, 404));
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
    const allItems = await model.findAll(options);
    res.status(200).json({
      status: 'success',
      data: {
        data: allItems
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
      return next(new globalErrorHandler(`No Item found with that id`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
