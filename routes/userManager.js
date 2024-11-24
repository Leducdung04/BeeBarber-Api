const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    await users.map((user)=> console.log(`User email:${user.email}`))
    

    res.render("userManager", { users: users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi lấy danh sách người dùng");
  }
});

module.exports = router;