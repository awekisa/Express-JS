const path = require('path')
const url = require('url')
const fs = require('fs')
const formidable = require('formidable')
const db = require('../database/instanodeDb')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/views/add-image.html' && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/add-image.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data.toString())
      res.end()
    })
  } else if (req.pathname === '/views/add-image.html' && req.method === 'POST') {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }


      let url = fields['url']
      let description = fields['description']
      let tagStrings = fields['tags']
      tagStrings = tagStrings.split(',')

      let addTagPromises = []
      let tagIds = []
      for (let tag of tagStrings) {
        let tagPromise = db.saveTag(tag).then(id => {
          tagIds.push(id.toString())
        })
        addTagPromises.push(tagPromise)
      }

      Promise.all(addTagPromises).then(() => {
        let image = {
          url: url,
          description: description,
          tags: tagIds
        }
        db.saveImage(image)
      })

      console.log()

      res.writeHead(302, {
        Location: '/'
      })
      res.end()
    })
  } else {
    return true
  }
}
