const express = require("express");
const {
  allProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  detailProduct,
  createReview,
  adminProducts,
} = require("../controllers/product");
const { authenticationMid, roleChecked } = require("../middleware/auth");

const router = express.Router();

router.get("/", allProducts);

router.get(
  "/admin/products",
  authenticationMid,
  roleChecked("admin"),
  adminProducts
);

router.post("/new", authenticationMid, roleChecked("admin"), createProduct);

router.post("/newReview", authenticationMid, createReview);

router
  .route("/id")
  .get(detailProduct)
  .delete(authenticationMid, roleChecked("admin"), deleteProduct)
  .patch(authenticationMid, roleChecked("admin"), updateProduct);

module.exports = router;
