const fs = require('fs')
const path = require('path')
const url = require('url')
const database = require('../database/database')
const query = require('querystring')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.pathname.startsWith('/form.html') && req.method === 'GET') {
    let formFile = path.normalize(
      path.join(__dirname, '../form.html'))

    fs.readFile(formFile, (err, data) => {
      if (err) {
        res.write(err)
        res.end()
        return
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data.toString())
      res.end()
    })
  } else if (req.method === 'POST') {
    let dataFile = database
    let result = ''
    req.on('data', data => { result += data })
    req.on('end', () => {
      let parsedResult = query.parse(result)
      let name = parsedResult.name
      let description = parsedResult.description
      let link = parsedResult.link
      if (!name || !link) {
        res.write('Invalid input. Try again!')
        res.end()
      }
      dataFile.images.add(name, description, link)
    })
    let pathHome = path.normalize(path.join(__dirname, '../form.html'))
    fs.readFile(pathHome, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        })
        res.write('404 not found!')
        res.end()
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write('Image added!')
      res.write(data.toString())
      res.end()
    })
  } else {
    return true
  }
}
