const fs = require('fs')
const path = require('path')
const url = require('url')
const database = require('../database/database')
const query = require('querystring')
const multiparty = require('multiparty')
const shortId = require('shortid')

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
    //
    let form = new multiparty.Form()
    let obj = {}

     // check if folder exists
    dataFile.getAll()
      .then(function (images) {
        images = JSON.parse(images)
        let subFold = 'image-folder-' + (images.length + 1 % 5)
        var dir = path.join('database/images', subFold)

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }
        // write in database

        form.parse(req, (err, fields, files) => {
          if (err) {
            console.log(err)
            return
          }
          obj.name = fields.name
          obj.description = fields.description
          obj.publicStatus = fields.public
          // generate random id for the file
          let fileName = shortId.generate()
          let fileUrl = dir + '/' + fileName + '.jpeg'
          obj.file = fileUrl
          let uploadFile = files['file'][0]
          let readStream = fs.createReadStream(uploadFile.path)
          let writeStream = fs.createWriteStream(fileUrl)
          readStream.pipe(writeStream)
          dataFile.add(obj)
        })
        form.on('close', () => {
          res.writeHead(302, {
            Location: '/'
          })
          res.end()
        })
      })
  } else {
    return true
  }
}
