import { initializeApp, cert } from "firebase-admin/app";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const serviceAccount = require("../flutter-e-book-app-firebase-adminsdk-tpaz8-25fbdd9648.json");
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "flutter-e-book-app.appspot.com",
});

const db = getFirestore();
const bucket = getStorage().bucket();
const auth = getAuth();

export { db, bucket, getDownloadURL, Timestamp, auth };
