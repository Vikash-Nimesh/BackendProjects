const mongoose = require('mongoose');
// const mongoURI = process.env.CONNECTION_URL;
const mongoURI = process.env.ATLAS_CONNECTION_URL;


async function connectToMongo() {
    await mongoose.connect(mongoURI)
    .then(() => {console.log("Connected to Mongo Successfully")})
    .catch((err) => {console.log(err)});
}

module.exports = connectToMongo;