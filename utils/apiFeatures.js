class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {
      ...this.queryString
    };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // delete execlude objects from queryObj
    excludeFields.forEach(val => delete queryObj[val]);
    // 2 Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    // replace gt gte lt lte
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.findAll({ where: JSON.parse(queryStr) });

    return this;
  }

  //   sort() {
  //     if (this.queryString.sort) {
  //       const sortBy = this.queryString.sort.split(',').join(' ');
  //       this.query = this.query.sort(sortBy);
  //     } else {
  //       // a negative sorts in descending order
  //       this.query = this.query.sort('-createdAt');
  //     }

  //     return this;
  //   }

  //   limitiFields() {
  //     if (this.queryString.fields) {
  //       const fields = this.queryString.fields.split(',').join(' ');
  //       this.query = this.query.select(fields);
  //     } else {
  //       // a negative excludes values from being sent to the client
  //       this.query = this.query.select('-__v');
  //     }

  //     return this;
  //   }

  //   paginate() {
  //     // 5 pagination and item limitting
  //     // ?page=2&limit=10 (1-10-->page1, 11-20-->page2, 21-30-->page3)
  //     // convert page to integer and a default of 1

  //     const page = this.queryString.page * 1 || 1;
  //     const limit = this.queryString.limit * 1 || 100;
  //     // prev page * number of results on each page
  //     const skip = (page - 1) * limit;

  //     this.query = this.query.skip(skip).limit(limit);
  //     return this;
  //   }
}

module.exports = APIFeatures;
