const http = require('http')
const port = 3000
const handlers = require('./handlers')

let enviroment = process.env.NODE_ENV || 'development'
const config = require('./config/config')
const database = require('./config/database.config')

database(config[enviroment])

http.createServer((req, res) => {
  for (let handler of handlers) {
    if (!handler(req, res)) {
      break
    }
  }
}).listen(port, () => {
  console.log(`Server runnung. Listening on port ${port}`)
})
