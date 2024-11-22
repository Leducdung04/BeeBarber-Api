const express = require("express");
const router = express.Router();

router.get("/categories_service", (req, res) => {
  res.render("categoriesService");
});
router.get("/addcategory", (req, res) => {
  res.render("addCategory");
});
module.exports = router;