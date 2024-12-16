require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const qs = require('qs')
const expressLayout = require('express-ejs-layouts');
const agenda = require("../BeeBarber-Api/config/agenda")
var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// zaloPay 
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const cors = require('cors');

const { isActiveRoute } = require('../BeeBarber-Api/helpers/routeHelpers')


var apiRouter = require("./routes/api");
const signInRouter = require("./routes/signIn");
const homeRouter = require("./routes/home");

var app = express();

app.use(cors());

const database = require('./config/db')
// view engine setup
app.set('layout', './layouts/signIn')
app.set("view engine", "ejs");

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.isActiveRoute = isActiveRoute;

//app.use('/', indexRouter);
app.use(expressLayout);
app.use("/api", apiRouter);
app.use("/", signInRouter);
app.use("/", homeRouter);

(async () => {
  await agenda.start();
})();

// zalo pay 
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// app.post("/zaloPay",async (req,res)=>{
//   const embed_data = {};
//   const  amount  = req.body.amount;

//   const items = [{}];
//   const transID = Math.floor(Math.random() * 1000000);
//   const order = {
//       app_id: config.app_id,
//       app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
//       app_user: "user123",
//       app_time: Date.now(), // miliseconds
//       item: JSON.stringify(items),
//       embed_data: JSON.stringify(embed_data),
//       amount: parseInt(amount),
//       description: `Bee Barber - Payment for the order #${transID}`,
//       bank_code: "zalopayapp",
//       callback_url:"https://0bfe-2001-ee0-45d8-9da0-4daf-2efd-91d2-c26c.ngrok-free.app/callback"
//   };

//   // appid|app_trans_id|appuser|amount|apptime|embeddata|item
//   const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
//   order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   axios.post(config.endpoint, null, { params: order })
//       .then(res => {
//           console.log(res.data);
//           return {
//                data: res.data,
//                app_trans_id :order.app_trans_id
//           }
//       })
//       .catch(err => console.log(err));
// })

app.post("/zaloPay", async (req, res) => {
  const embed_data = {};
  const amount = req.body.amount;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid or missing amount" });
  }

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: parseInt(amount), // sử dụng amount từ req.body
    description: `Bee Barber - Payment for the order #${transID}`,
    bank_code: "zalopayapp",
    callback_url: "https://0bfe-2001-ee0-45d8-9da0-4daf-2efd-91d2-c26c.ngrok-free.app/callback"
  };

  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const response = await axios.post(config.endpoint, null, { params: order });
    console.log(response.data);
    res.json({
      data: response.data,
      app_trans_id: order.app_trans_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process ZaloPay payment" });
  }
});


// call zalopay
app.post('/callback', (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

// check trạng thái zalopay 

app.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
  }

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


  let postConfig = {
    method: 'post',
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  };

  axios(postConfig)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.json(response.data);
      //response.data
    })
    .catch(function (error) {
      console.log(error);
    });
})

// app.post("/order-status/:app_trans_id", async (req, res) => {
//   const app_trans_id = req.params.app_trans_id;

//   let postData = {
//       app_id: config.app_id,
//       app_trans_id: app_trans_id, 
//   };

//   let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
//   postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   let postConfig = {
//       method: 'post',
//       url: config.endpoint,
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       data: qs.stringify(postData)
//   };

//   try {
//       const response = await axios(postConfig);
//       console.log("Response from ZaloPay:", response.data);
//       res.json(response.data); // Gửi dữ liệu phản hồi về client
//   } catch (error) {
//       console.error("Error making request to ZaloPay:", error);
//       res.status(500).json({ error: "Không thể lấy trạng thái đơn hàng từ ZaloPay" });
//   }
// });

database.connect();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
