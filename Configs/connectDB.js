const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("../flutter-e-book-app-firebase-adminsdk-tpaz8-25fbdd9648.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "flutter-e-book-app.appspot.com",
});

const db = getFirestore();
const bucket = getStorage().bucket();
const auth = getAuth();

module.exports = { db, bucket, getDownloadURL, Timestamp, auth };
