const path = require('path')
const url = require('url')
const fs = require('fs')
const db = require('../database/instanodeDb')
const Tag = require('../models/Tag')
const Image = require('../models/Image')
const formidable = require('formidable')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/views/search-by-tag.html' && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/search-by-tag.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      let options = ''
      Tag.find({}).then(tags => {
        for (let tag of tags) {
          options += `<option class="option">${tag.name}</option>`
        }
        let html = data.toString().replace('{options}', options)
        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.write(html)
        res.end()
      })
    })
  } else if (req.pathname === '/views/search-by-tag.html' && req.method === 'POST') {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }

      let content = ''

      let tagName = fields['tag']
      Tag.findOne({name: tagName})
        .then((tag) => {
          let imageIds = tag.images
          let imagePromises = []
          for (let id of imageIds) {
            let imagePromise = Image
              .findById(id)
              .then((image) => {
                content += `
                <div class="image-container">
                  <img class="image" src="${image.url}" height="150" width="150">
                </div>`
              })
            imagePromises.push(imagePromise)
          }
          Promise.all(imagePromises).then(() => {
            let filePath = path.normalize(
              path.join(__dirname, '../views/search-by-tag.html'))
            fs.readFile(filePath, (err, data) => {
              if (err) {
                console.log(err)
                return
              }

              let options = ''
              Tag.find({}).then(tags => {
                for (let tag of tags) {
                  options += `<option class="option">${tag.name}</option>`
                }
                let html = data.toString().replace('{options}', options)
                html = html.replace('{images}', content)
                res.writeHead(200, {
                  'Content-Type': 'text/html'
                })
                res.write(html)
                res.end()
              })
            })
          })
        })
    })
  } else {
    return true
  }
}
