const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: { 
    type: String,
    required: true,
  },
  join_date: { 
    type: String,
    required: true,
  },
  bio: {
    type: String,
    //required: true, // for error correction. should not be required
    //default: '' // Provide a suitable default value
  },
  picture_url: {
    type: String,
    //required: true, // for error correction. should not be required
    default: 'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg'
  }
}, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);