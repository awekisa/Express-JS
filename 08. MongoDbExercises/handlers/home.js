const url = require('url')
const fs = require('fs')
const path = require('path')
const Image = require('../models/Image')
const Tag = require('../models/Tag')
const qs = require('querystring')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/' && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/index.html'))

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

      //

      // Tag.create({name: 'dog'}).then(() => {
      //   console.log('saved')
      // })
      // let images = [
      //   {
      //     url: 'http://www.hlgjyl888.com/data/wallpapers/73/WDF_1186892.jpg',
      //     decription: 'kewl cats'
      //   },
      //   {
      //     url: 'https://www.google.bg/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwit2e6SnqHUAhUGcRQKHcl_CKoQjBwIBA&url=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F01%2F05%2F17%2F51%2Fdog-1123016_960_720.jpg&psig=AFQjCNHvxeiUk9ZTNQzheIReieE9BbiNTw&ust=1496564171851205',
      //     description: 'white dog'
      //   }
      // ]
      // for (let image of images) {
      //   Image.create({url: image.url, description: image.description}).then(() => {
      //     console.log('saved image')
      //   })
      // }

      // Image.findById('593270b5ce38f7273833a6b0').then((image) => {
      //   Tag.findOne({name: 'dog'}).then((tag) => {
      //     image.tags.push(tag._id)
      //     image.save(image).then((updImage) => {
      //       console.log(updImage.tags)
      //     })
      //   })
      // })

      //

      let html = data.toString()
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
