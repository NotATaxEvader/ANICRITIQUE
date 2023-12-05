const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, { collection: 'status' });

module.exports = mongoose.model('Status', StatusSchema);