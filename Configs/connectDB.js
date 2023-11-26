const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const serviceAccount = require('../flutter-e-book-app-firebase-adminsdk-tpaz8-25fbdd9648.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore()

module.exports = { db }