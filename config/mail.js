var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "beebarber4@gmail.com",
        pass: "xnwr pehg kqjw vffr"
    }
});
module.exports = transporter 