require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');

const app = express();
const PORT = 3000;
connectDB();

app.use(express.json());
app.use('*', (req, res) => {
  return res.status(404).json('Route not found 🦖');
});

app.listen(PORT, () => {
  console.log(`Listening loud and clear @ http://localhost:${PORT}`);
});
