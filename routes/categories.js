const express = require("express");
const router = express.Router();

router.get("/categories_product", (req, res) => {
  res.render("categories");
});
router.get("/addcategory", (req, res) => {
  res.render("addCategory");
});
module.exports = router;
