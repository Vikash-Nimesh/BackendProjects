const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema(
  {
    post_name: {
      type: String,
      require: true
    },
    post_description: {
      type: String
    },
    post_image: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', userSchema)
