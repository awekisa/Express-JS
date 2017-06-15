const path = require('path')
const url = require('url')
const fs = require('fs')
const db = require('../database/instanodeDb')
const Tag = require('../models/Tag')
const Image = require('../models/Image')
const formidable = require('formidable')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/views/search-by-date.html' && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/search-by-date.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      let html = data.toString()
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(html)
      res.end()
    })
  } else if (req.pathname === '/views/search-by-date.html' && req.method === 'POST') {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }

      let formData = {
        after: fields['date-after'],
        before: fields['date-before'],
        show: fields['show']
      }

      db.showDates(formData).then(images => {
        let content = ''
        for (let image of images) {
          content += `
          <div class="image-container">
            <img class="image" src="${image.url}" height="150" width="150">
          </div>`
        }
        let filePath = path.normalize(
          path.join(__dirname, '../views/search-by-date.html'))
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.log(err)
            return
          }

          let html = data.toString().replace('{images}', content)
          res.writeHead(200, {
            'Content-Type': 'text/html'
          })
          res.write(html)
          res.end()
        })
      })
    })
  } else {
    return true
  }
}
