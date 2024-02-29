const mongoose = require('mongoose')
const CONNECTION_URI = process.env.CONNECTION_URL

async function connectToMongoose () {
  await mongoose
    .connect(CONNECTION_URI)
    .then(() => {
      console.log('Conneted to mongoose successfully')
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = connectToMongoose;
