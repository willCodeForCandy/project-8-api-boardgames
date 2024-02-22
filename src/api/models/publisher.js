const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    contry: { type: String, trim: true, required: true },
    publishedGames: {
      type: [mongoose.Types.ObjectId],
      ref: boardgames
    }
  },
  { timestamps: true, collection: 'publishers' }
);

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
