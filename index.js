require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const userRoutes = require('./src/api/routes/user');
const boardgameRouter = require('./src/api/routes/boardgame');
const publisherRouter = require('./src/api/routes/publisher');
const { connectCloudinary } = require('./src/config/cloudinary');

const app = express();
const PORT = 3000;
connectDB();
connectCloudinary();
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/boardgames', boardgameRouter);
app.use('/api/v1/publishers', publisherRouter);
app.use('*', (req, res) => {
  return res.status(404).json('Route not found 🦖');
});

app.listen(PORT, () => {
  console.log(`Listening loud and clear @ http://localhost:${PORT}`);
});
