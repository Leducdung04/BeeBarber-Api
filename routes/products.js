const express = require("express");
const router = express.Router();

router.get("/products", (req, res) => {
  res.render("products");
});
router.get("/addproduct", (req, res) => {
  res.render("addProduct");
});
module.exports = router;
