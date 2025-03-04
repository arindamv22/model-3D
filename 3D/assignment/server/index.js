const express = require("express");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "d-mini-app.appspot.com", // Replace with your Firebase Storage bucket
});

const bucket = admin.storage().bucket();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// API to upload 3D model
app.post("/upload", upload.single("model"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const storageFile = bucket.file(fileName);

  fs.createReadStream(filePath)
    .pipe(storageFile.createWriteStream())
    .on("finish", async () => {
      const [url] = await storageFile.getSignedUrl({ action: "read", expires: "03-01-2030" });
      res.json({ message: "File uploaded successfully", url });
    })
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

// API to list uploaded models
app.get("/models", async (req, res) => {
  const [files] = await bucket.getFiles();
  const urls = await Promise.all(files.map(async (file) => {
    const [url] = await file.getSignedUrl({ action: "read", expires: "03-01-2030" });
    return { name: file.name, url };
  }));
  res.json(urls);
});

// Start server
app.listen(5001, () => console.log("Server running on port 5001"));
