const dotenv = require("dotenv");
dotenv.config({path:"utils/.env"})
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT
const CONNECTION_URL = process.env.CONNECTION_URL

app.use(express.json());
app.use(cors("*"));
app.use(logger("dev"))


//routes
const indexRouter = require("./routes/index");

app.use("/",indexRouter)


mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect)`));