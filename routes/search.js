require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Asset schema and model directly within this script
const assetSchema = new mongoose.Schema({
  collectionName: String,
  mindFileUrl: String,
  videoFileUrls: [String],
  qrCodeUrl: String,
  status: String,
});

// Create the model from the schema
const Asset = mongoose.model('Asset', assetSchema);

// Define the search endpoint
router.get('/search', async (req, res) => {
  try {
    const { collection_name } = req.query;
    if (!collection_name) {
      return res.status(400).json({ alert: "error", error: "No collection name provided." });
    }

    const collectionNameQuery = decodeURIComponent(collection_name);
   

    const result = await Asset.findOne({ collectionName: collectionNameQuery });

    if (result) {

      let data = [];

      for (let i = 0; i < result.videoFileUrls.length; i++) {
        // Assuming each video URL should be paired with the same mind file URL
        let pair = {};
        pair[`mind${i + 1}`] = result.mindFileUrl;
        pair[`video${i + 1}`] = result.videoFileUrls[i];
        data.push(pair);
      }

      let qrData = {
        collectionName: result.collectionName,
        status: result.status,
        data: data // Now 'data' is an array of objects
      };

      res.json({ alert: "success", data: qrData });
      console.log("QR Data :", qrData);
    } else {
      res.status(404).json({ alert: "error", error: "No results found for the specified collection name." });
    }
  } catch (error) {
    console.error("Error searching the Asset collection:", error);
    res.status(500).json({ alert: "error", error: "Database error" });
  }
});


module.exports = router;
