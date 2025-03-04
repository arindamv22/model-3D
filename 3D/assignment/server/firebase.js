const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "YOUR_STORAGE_BUCKET_URL",
})

const db = getFirestore()
const storage = getStorage().bucket()

module.exports = { db, storage }
