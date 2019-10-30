// class APIFeatures {}

// module.exports = APIFeatures;

const { Op } = require('sequelize');

exports.AdvancedSerch = obj => {
  const { querryObj, querryParams } = { ...obj };
  if (Object.keys(querryObj).length) {
    Object.keys(querryObj).forEach(el => {
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

    return Object.assign(querryParams.where, querryObj);
  }
};

exports.Sort = Obj => {
  const { querryParams, req } = { ...Obj };
  //   Todo
  //   fix sorting Bug
  if (req.query.order) {
    querryParams.order = [[...req.query.order]];
  } else {
    querryParams.order = [['createdAt', 'DESC']];
  }
  return {
    req,
    querryParams
  };
};

exports.FieldLimiting = Obj => {
  const { querryParams, req } = { ...Obj };
  if (req.query.fields) {
    const fieldArray = req.query.fields.split(',');
    querryParams.attributes = fieldArray;
  }
  return {
    req,
    querryParams
  };
};

exports.PagePaginate = Obj => {
  let { querryParams, req } = { ...Obj };
  if (req.query.limit && req.query.page) {
    const limit = req.query.limit * 1 || 1;
    const page = req.query.page * 1 || 10;
    const offset = (page - 1) * limit;
    querryParams = { ...querryParams, offset, limit };
  }
  return querryParams;
};
