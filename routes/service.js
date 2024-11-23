const express = require("express");
const router = express.Router();

router.get("/services", (req, res) => {
  res.render("services");
});
router.get("/add_service", (req, res) => {
  res.render("addService");
});
module.exports = router;