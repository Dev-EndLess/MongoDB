const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
})

// Mongoose automatically looks for the plural, lowercased version of your model name
module.exports = mongoose.model('User', userSchema)