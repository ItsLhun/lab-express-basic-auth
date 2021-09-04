const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHashAndSalt: {
    type: String, //we should never set a password in plain text, we should save it with a robust hashing encryption. We store the result after hashing.
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
