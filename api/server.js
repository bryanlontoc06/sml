require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(cors());

app.get('/', (req, res) => {
  res.json([
    {
      "id":"1",
      "title":"Book Review: The Bear & The Nightingale ABC"
    },
    {
      "id":"2",
      "title":"Game Review: Pokemon Brillian Diamond"
    },
    {
      "id":"3",
      "title":"Show Review: Alice in Borderland"
    }
  ])
})

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})