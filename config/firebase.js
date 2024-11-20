var admin = require("firebase-admin");

var serviceAccount = require("../config/beebarber-3a718-firebase-adminsdk-g3v02-8bb261896a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beebarber-3a718-default-rtdb.firebaseio.com"
});

module.exports = admin