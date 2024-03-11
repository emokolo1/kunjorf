require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const searchRouter = require('./routes/search');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(express.static('public')); // Serve static files
app.use('/', searchRouter); // Use the search router

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
