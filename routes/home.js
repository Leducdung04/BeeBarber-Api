const express = require("express");
const router = express.Router();

const admin = "layouts/index"; 

router.get("/categories_product", (req, res) => {
  const locals = {
    currentRoute: `/categories_product`,
    title: "Hello",
  }
  res.render("admin/categories", { locals, layout: admin });
});

router.get("/addcategory", (req, res) => {
  const locals = {
    currentRoute: `/addcategory`,
    title: "Hello",
  }
  res.render("admin/addCategory", { locals, layout: admin });
});

router.get("/products", (req, res) => {
  const locals = {
    currentRoute: `/products`,
    title: "Hello",
  }
  res.render("admin/products", { locals, layout: admin });
});

router.get("/addproduct", (req, res) => {
  const locals = {
    currentRoute: `/addproduct`,
    title: "Hello",
  }
  res.render("admin/addProduct", { locals, layout: admin });
});

router.get("/services", (req, res) => {
  const locals = {
    currentRoute: `/services`,
    title: "Hello",
  }
  res.render("admin/services", { locals, layout: admin });
});
router.get("/add_service", (req, res) => {
  const locals = {
    currentRoute: `/add_service`,
    title: "Hello",
  }
  res.render("admin/addService", { locals, layout: admin });
});

router.get("/categories_service", (req, res) => {
  const locals = {
    currentRoute: `/categories_service`,
    title: "Hello",
  }
  res.render("admin/categoriesService", { locals, layout: admin });
});

router.get("/addcategoryService", (req, res) => {
  const locals = {
    currentRoute: `/addcategoryService`,
    title: "Hello",
  }
  res.render("admin/addCategoryService", { locals, layout: admin });
});

router.get("/statistical", (req, res) => {
  const locals = {
    currentRoute: `/statistical`,
    title: "Hello",
  }
  res.render("admin/satistical", { locals, layout: admin });
});


router.get("/user", (req, res) => {
  const locals = {
    currentRoute: `/user`,
    title: "Hello",
  }
  res.render("admin/user", { locals, layout: admin });
});


module.exports = router;
