const { Decimal128 } = require('bson');
const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  jp_title: {
    type: String,
    required: true,
  },
  en_title: {
    type: String,
    required: true,
  },
  synopsis: { 
    type: String,
    required: true,
  },
  studio: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  premiere: { 
    type: String,
    required: true,
  },
  episode_count: { 
    type: String,
    required: true,
  },
  rating: { 
    type: String,
    required: true,
  },
  ave_score: { 
    type: Number,
  },
  image: { 
    type: String,
    required: true,
  },
  summ: { 
    type: String,
    required: true,
  },
}, { collection: 'anime' });

module.exports = mongoose.model('Anime', AnimeSchema);
