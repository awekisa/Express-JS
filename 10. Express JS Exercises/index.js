const port = 3000
const config = require('./config/config')
const database = require('./config/database.config')
const express = require('express')
let enviroment = process.env.NODE_ENV || 'development'

let app = express()

database(config[enviroment])
require('./config/express')(app, config[enviroment])
require('./config/routes')(app)



app.listen(port, () => {
  console.log(`Server runnung. Listening on port ${port}`)
})
