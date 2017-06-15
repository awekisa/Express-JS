const Image = require('../data/Image')

module.exports = (images) => {
  return new Promise((resolve, reject) => {
    let promises = []
    for (let image of images) {
      let promise = new Promise((resolve, reject) => {
        image.views += 1
        image
          .save()
          .then((savedImage) => {
            resolve(savedImage)
          })
      })
      promises.push(promise)
    }
    Promise.all(promises)
      .then(() => {
        resolve()
      })
  })
}
