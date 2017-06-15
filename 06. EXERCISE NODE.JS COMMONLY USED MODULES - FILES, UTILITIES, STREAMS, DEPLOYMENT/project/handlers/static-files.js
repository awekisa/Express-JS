const fs = require('fs')
const path = require('path')
const url = require('url')
// const database = require('../database/database')

function getContentType(url) {
  let contentType = 'text/plain'
  if (url.endsWith('.css')) {
    contentType = 'text/css'
  } else if (url.endsWith('.html')) {
    contentType = 'text.html'
  }
  return contentType
}
function validateFiles(file) {
  if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.jpeg') || file.endsWith('.ico')) {
    return true
  }
  return false
}

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.method === 'GET' && validateFiles(req.pathname)) {
    let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        })
        res.write('404 not found!')
        res.end()
        return
      }
      res.writeHead(200, {
        'Content-Type': getContentType(req.pathname)})
      res.write(data)
      res.end()
    })
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    })
    res.write('FU, no file or not for you')
    res.end()
    return true
  }
}



