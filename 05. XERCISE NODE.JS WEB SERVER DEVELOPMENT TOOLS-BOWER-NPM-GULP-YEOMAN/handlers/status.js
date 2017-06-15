const fs = require('fs')
const database = require('../database/database')

module.exports = (req, res) => {
  let statusHeader = req.headers['statusheader']
  if (statusHeader && statusHeader === 'Full') {
    fs.readFile('./status.html', 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      let totalImages = database.images.getAll()

      totalImages.then((images) => {
        images = JSON.parse(images)
        data = data.replace('{***}', `<h1>Total images - ${images.length}</h1>`)

        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.write(data)
        res.end()
      })
      .catch((err) => {
        console.log(err)
        return
      })
    })
  } else {
    return true
  }
}

