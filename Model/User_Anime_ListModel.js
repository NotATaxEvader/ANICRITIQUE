const mongoose = require('mongoose');

const User_Anime_ListSchema = new mongoose.Schema({
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
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status', // Assuming 'Studio' is the name of your referenced model
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  ep_watched: {
    type: String,
    required: true,
  },
}, { collection: 'user_anime_list' });

module.exports = mongoose.model('User_Anime_List', User_Anime_ListSchema);