class ApiFeatures {
  constructor(query, queryString, Model) {
    this.query = query;
    this.queryString = queryString;
    this.Model = Model;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort;
      sortBy = sortBy.split(",").join("  ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  fieldsLimiting() {
    if (this.queryString.fields) {
      let { fields } = this.queryString;
      fields = fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const querySearch = {};
      querySearch.$or = [
        {
          title: { $regex: this.queryString.keyword, $options: "i" },
        },
        {
          description: { $regex: this.queryString.keyword, $options: "i" },
        },
      ];

      this.query = this.Model.find(querySearch);
    }
    return this;
  }
}

module.exports = ApiFeatures;
