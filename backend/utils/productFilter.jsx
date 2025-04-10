class ProductFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const deleteArea = ["keyword", "page", "limit"];

    deleteArea.forEach((item) => {
      delete this.queryCopy[item];
    });

    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(eq|gt|gte|lte|lt|ne)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const activePage = this.queryStr.page || 1;

    const skip = resultPerPage * (activePage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ProductFilter;
