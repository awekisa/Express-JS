const url = require('url')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.pathname === '/' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/index.html'))

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        })
        res.write('404 not found!')
        res.end()
        return
      }
      let content = ''
      let files = require('../database/database.json')
      for (let file of files) {
        if (file.publicStatus[0] === 'true') {
          let pathFile = file.file
          content +=
          `<div class="image-wrapper">
          <img class="image" src="${pathFile}">
          </div>`
        }
      }

      let html = data.toString().replace('{***}', content)
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(html)
      res.end()
    })
  } else {
    return true
  }
}
