require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the Asset schema and model directly within this script
const assetSchema = new mongoose.Schema({
  collectionName: String,
  mindFileUrl: String,
  videoFileUrls: [String],
  qrCodeUrl: String,
  status: String
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

    // Directly use the query parameter without transforming it
    const collectionNameQuery = decodeURIComponent(collection_name);
    
    console.log(`Searching for collectionName: '${collectionNameQuery}'`); // Debugging

    const result = await Asset.findOne({ collectionName: collectionNameQuery });

    if (result) {
      console.log("Found result:", result); // Debugging
      
      // Specifically wrap the result in a 'qrData' object
      const qrData = {
        qrData: {
          collectionName: result.collectionName,
          mindFileUrl: result.mindFileUrl,
          videoFileUrls: result.videoFileUrls,
          status: result.status
        }
      };

      // Send the wrapped qrData object
      res.json({ alert: "success", data: qrData });
    } else {
      console.log("No results found for:", collectionNameQuery); // Debugging
      res.status(404).json({ alert: "error", error: "No results found for the specified collection name." });
    }
  } catch (error) {
    console.error("Error searching the Asset collection:", error);
    res.status(500).json({ alert: "error", error: "Database error" });
  }
});

module.exports = router;
