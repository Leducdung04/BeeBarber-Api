const express = require("express");
const router = express.Router();

const admin = "layouts/index";

router.get("/home", (req, res) => {
  const locals = {
    currentRoute: `/home`,
    title: "Hello",
  }
  res.render("admin/home", { locals, layout: admin });
});

router.get("/orders", (req, res) => {
  const locals = {
    currentRoute: `/order`,
    title: "Hello",
  }
  res.render("admin/order", { locals, layout: admin });
});

router.get("/categories_services", (req, res) => {
  const locals = {
    currentRoute: `/category_service`,
    title: "Hello",
  }
  res.render("admin/categoryService", { locals, layout: admin });
});

router.get("/services", (req, res) => {
  const locals = {
    currentRoute: `/service`,
    title: "Hello",
  }
  res.render("admin/service", { locals, layout: admin });
});

router.get("/categories_products", (req, res) => {
  const locals = {
    currentRoute: `/category_product`,
    title: "Hello",
  }
  res.render("admin/category", { locals, layout: admin });
});

router.get("/products", (req, res) => {
  const locals = {
    currentRoute: `/product`,
    title: "Hello",
  }
  res.render("admin/product", { locals, layout: admin });
});

router.get("/banners", (req, res) => {
  const locals = {
    currentRoute: `/banner`,
    title: "Hello",
  }
  res.render("admin/banner", { locals, layout: admin });
});

router.get("/barbers", (req, res) => {
  const locals = {
    currentRoute: `/barber`,
    title: "Hello",
  }
  res.render("admin/barber", { locals, layout: admin });
});


router.get("/statisticals", (req, res) => {
  const locals = {
    currentRoute: `/statistical`,
    title: "Hello",
  }
  res.render("admin/statistical", { locals, layout: admin });
});


router.get("/revenues", (req, res) => {
  const locals = {
    currentRoute: `/revenue`,
    title: "Hello",
  }
  res.render("admin/revenue", { locals, layout: admin });
});


module.exports = router;
