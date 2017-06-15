const fs = require('fs')
const path = require('path')
const url = require('url')
const database = require('../database/database')

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
  if (req.pathname.startsWith('/content/') && req.method === 'GET' && validateFiles(req.pathname)) {
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
  } else if (req.pathname.startsWith('/container/')) {
    let num = parseInt(path.parse(req.pathname).name)
    let plugin = database.images.getSpecificImage(num)
    plugin.then((image) => {
      let content =
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="icon" href="../content/images/favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="../content/styles/basic.css" type='text/css' />
</head>
<body>
  <section class='image-section'>
    <div class="image-single">
    <h2>${image.name}</h2>
    <img class="image-link" src="${image.link}" width="320" height='240'>
    <p>${image.description}</p>
  </div>
  <a href='../' class='back-btn'>Back</a>
  </section>
</body>
</html>`

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(content)
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



