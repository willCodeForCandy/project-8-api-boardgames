require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const userRoutes = require('./src/api/routes/user');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = 3000;
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY
});
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('*', (req, res) => {
  return res.status(404).json('Route not found 🦖');
});

app.listen(PORT, () => {
  console.log(`Listening loud and clear @ http://localhost:${PORT}`);
});
