const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'Studio' is the name of your referenced model
    required: true,
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime', // Assuming 'Studio' is the name of your referenced model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, { collection: 'review' });

module.exports = mongoose.model('Review', ReviewSchema);