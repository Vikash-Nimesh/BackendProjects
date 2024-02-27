require("dotenv").config();
const connectToMongoo = require('./db')
const express = require('express')

connectToMongoo()

const {PORT} = process.env

const app = express()

app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Welcome to iNoteBook')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
