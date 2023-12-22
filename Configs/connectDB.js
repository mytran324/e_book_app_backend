const { initializeApp, cert } = require('firebase-admin/app')
const { getStorage, getDownloadURL } = require('firebase-admin/storage');
const { getFirestore, Timestamp  } = require('firebase-admin/firestore')
const serviceAccount = require('../flutter-e-book-app-firebase-adminsdk-tpaz8-25fbdd9648.json');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "flutter-e-book-app.appspot.com",
});

const db = getFirestore();
const bucket = getStorage().bucket();

module.exports = { db, bucket, getDownloadURL,Timestamp }