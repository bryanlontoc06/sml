const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./middleware/logEvents');

const PORT = process.env.PORT || 3500;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})