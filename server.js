require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./src/routers/api')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, true)
  },
  optionSuccessStatus: 200,

  credentials: true,
}
app.use(cookieParser())
app.use(express.json());
app.use(cors(corsOptions))

app.use(router);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})