const Image = require('../data/Image')

module.exports = {
  like: (imageId, userId) => {
    return new Promise((resolve, reject) => {
      Image
      .findById(imageId)
      .then(image => {
        if (image.likes.indexOf(userId) >= 0) {
          reject(new Error('Image is already liked by that user!'))
        } else {
          image.likes.push(userId)
          image
            .save()
            .then(() => {
              resolve('Image liked!')
            })
        }
      })
      .catch(() => {
        reject(new Error('Image not found!'))
      })
    })
  },
  dislike: (imageId, userId) => {
    return new Promise((resolve, reject) => {
      Image
      .findById(imageId)
      .then(image => {
        let index = image.likes.indexOf(userId)
        if (index < 0) {
          reject(new Error('Image is not liked by that user'))
        } else {
          image.likes.splice(index, 1)
          image
            .save()
            .then(() => {
              resolve('Image is disliked')
            })
        }
      })
      .catch(() => {
        reject(new Error('Image not found!'))
      })
    })
  }
}
