const admin = require('firebase-admin');


// admin.initializeApp({
//   credential: admin.credential.cert({
//     private_key: privateKey,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,  
//     project_id: "beebarber-3a718",
//   }),
// });

module.exports = admin;
