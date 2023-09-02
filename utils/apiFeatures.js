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

  paginate(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIdx = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.noOfPages = Math.ceil(documentsCount / limit);

    if (endIdx < documentsCount) pagination.nextPage = page + 1; // next page
    if (skip > 0) pagination.prevPage = page - 1; // prev page

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
