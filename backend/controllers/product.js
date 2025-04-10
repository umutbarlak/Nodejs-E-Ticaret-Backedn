const Product = require("../models/product.js");
const ProductFilter = require("../utils/productFilter.jsx");
const cloudinary = require("cloudinary").v2;

const allProducts = async (req, res) => {
  const resultPerPage = 10;

  const productFilter = new ProductFilter(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await productFilter.query;

  res.status(200).json({
    products,
  });
};

const adminProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    products,
  });
};

const detailProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    product,
  });
};

const createProduct = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let allimage = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    allimage.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = allimage;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    product,
  });
};

const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }
  await product.remove();
  res.status(200).json({
    message: "Ürün başarıyla silindi",
  });
};

const updateProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
  }

  let allimage = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    allimage.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
};

const createReview = async (req, res, next) => {
  const { productId, comment, rating } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);
  product.reviews.push(review);

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Yorum başarı ile eklendi",
  });
};

module.exports = {
  allProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
};
