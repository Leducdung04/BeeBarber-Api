const express = require("express");
const router = express.Router();

router.get("/categories_service", (req, res) => {
  res.render("categoriesService");
});
router.get("/addcategoryService", (req, res) => {
  res.render("addCategoryService");
});
module.exports = router;