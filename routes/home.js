const express = require("express");
const Order_Product = require("../models/oder_product");
const User = require("../models/user");
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

router.get("/stylists", (req, res) => {
  const locals = {
    currentRoute: `/stylist`,
    title: "Hello",
  }
  res.render("admin/barber", { locals, layout: admin });
});


router.get("/statisticals", (req, res) => {
  const locals = {
    currentRoute: `/statistical`,
    title: "Hello",
  }
  res.render("admin/statistical", { locals, layout: admin,  });
});


router.get("/revenues", (req, res) => {
  const locals = {
    currentRoute: `/revenue`,
    title: "Hello",
  }
  res.render("admin/revenue", { locals, layout: admin });
});

router.get("/showDetailOrder/:orderId", async (req, res) => {
  const locals = {
    currentRoute: `/showDetailOrder`,
    title: "Hello",
  }
  try {
    const orderId = req.params.orderId;
    console.log(orderId)
    const order = await Order_Product.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const user = await User.findById(order.user_id);
    if (!user) {
      return res.status(404).send("User not found"); 
    }

    res.render("admin/showDetailOrder", { locals, layout: admin, order, user, title:"Detail Order" });
  } catch (err) {
    console.error("Error retrieving order details:", err);
    res.status(500).send("Error retrieving order details");
  }
});

router.get("/customers", async (req, res) => {
  try {
    const locals = {
      currentRoute: `/customer`,
      title: "Hello",
    }
    res.render("admin/customer", {locals, layout: admin});
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi lấy danh sách người dùng");
  }
});

router.get("/oders", (req, res) => {
  const locals = {
    currentRoute: `/oder`,
    title: "Hello",
  }
  res.render("admin/oder", { locals, layout: admin,  });
});

module.exports = router;
