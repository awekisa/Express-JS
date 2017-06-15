const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '/database.json')


let getImages = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dbPath)) {
      fs.writeFile(dbPath, '[]', (err) => {
        if (err) throw err
        return []
      })
    }
    fs.readFile(dbPath, (err, data) => {
      if (err) {
        reject(err)
      }
      return resolve(data)
    })
  })
}
let getImage = (num) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, (err, data) => {
      if (err) {
        reject(err)
      }
      data = JSON.parse(data)
      for (let image of data) {
        if (image.id === num) {
          return resolve(image)
        }
      }
    })
  })
}

let saveImages = (images) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath, JSON.stringify(images, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {}
module.exports.add = (obj) => {
  getImages()
    .then((images) => {
      images = JSON.parse(images)
      images.push(obj)
      return images
    })
    .then((images) => {
      return saveImages(images)
    }).catch((err) => console.log(err))
}
module.exports.getAll = getImages
module.exports.getSpecificImage = getImage
