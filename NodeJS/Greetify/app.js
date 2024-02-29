require("dotenv").config();
const express = require('express');
const connectToMongoose = require('./db');
const fileUploader = require("./middleware/fileUploader");


connectToMongoose()

const app = express()
const port = 786


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to Greetify')
})

app.post('/upload', (req, res) => {
  console.log('🤣')
  // console.log(req)
  console.log(req.body)
  return res.send(req.body)
})

//available routes
app.use('/api/auth',require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
