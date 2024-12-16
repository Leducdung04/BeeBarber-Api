var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beebarber-3a718-default-rtdb.firebaseio.com"
});

module.exports = admin