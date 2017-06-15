const Image = require('../data/Image')
const Handler = require('../data/Handler')
const User = require('../data/User')
const errorHandler = require('../utilities/error-handler')
const likesUpdater = require('../utilities/likes-updater')

function parseTags (arr) {
  let tags = []
  for (let str of arr) {
    if (str.search('#') === 0) {
      str = str.substring(1)
      if (!/#/.test(str)) {
        tags.push(str)
      }
    }
  }
  return tags.filter(String)
}

function parseHandlers (arr) {
  let tags = []
  for (let str of arr) {
    if (str.search('@') === 0) {
      str = str.substring(1)
      if (!/@/.test(str)) {
        tags.push(str)
      }
    }
  }
  return tags.filter(String)
}

function createHandlers (handlers, imageId) {
  let handlersPromise = []
  for (let handler of handlers) {
    let promise = new Promise((resolve, reject) => {
      User
        .findOne({username: handler})
        .then(user => {
          Handler
            .create({
              user: user._id,
              image: imageId
            })
            .then(newHandler => {
              console.log('New Handler created')
              resolve()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log('No user found!')
          resolve()
        })
    })
    handlersPromise.push(promise)
  }
  return handlersPromise
}

function deleteHandlers (imageId) {
  return new Promise((resolve, reject) => {
    Handler
      .find({image: imageId})
      .then(images => {
        let deletePromises = []
        for (let image of images) {
          let delPromise = new Promise((resolve, reject) => {
            image
              .remove()
              .then(remImage => {
                resolve(remImage)
              })
          })
          deletePromises.push(delPromise)
        }
        Promise.all(deletePromises)
          .then(() => {
            resolve()
          })
      })
  })
}

module.exports = {
  addGet: (req, res) => {
    res.render('images/add')
  },
  addPost: (req, res) => {
    let description = req.body.description
    let url = req.body.image
    let userId = req.user.id

    let msgArray = description.split(/[\s,.!?]/).filter(String)
    let tags = parseTags(msgArray)
    let handlers = parseHandlers(msgArray)

    Image
      .create({
        description: description,
        image: url,
        author: userId,
        tags: tags
      })
      .then(image => {
        if (handlers.length > 0) {
          let handleCreaterArr = createHandlers(handlers, image._id)
          Promise.all(handleCreaterArr)
            .then(() => {
              console.log('Handlers created!')
              res.redirect('/')
            })
        } else {
          console.log('No handlers created!')
          res.redirect('/')
        }
      })
      .catch(err => {
        let errMsg = errorHandler.handleMongooseError(err)
        res.locals.globalError = errMsg
        res.render('images/add', {
          image: url,
          description: description
        })
      })
  },
  editGet: (req, res) => {
    let imageId = req.params.id

    Image
      .findById(imageId)
      .then(image => {
        res.render('images/edit', {
          description: image.description,
          image: image.image,
          id: image._id
        })
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  },
  editPost: (req, res) => {
    let imageId = req.params.id
    let description = req.body.description
    let url = req.body.image
    let msgArray = description.split(/[\s,.!?]/).filter(String)
    let tags = parseTags(msgArray)
    let handlers = parseHandlers(msgArray)

    Image
      .findById(imageId)
      .then(image => {
        deleteHandlers(image._id)
          .then(() => {
            image.description = description
            image.image = url
            image.tags = tags
            if (handlers.length > 0) {
              let handleCreaterArr = createHandlers(handlers, image._id)
              Promise.all(handleCreaterArr)
                .then(() => {
                  console.log('Handlers created!')
                  image
                    .save()
                    .then(savedImage => {
                      res.redirect('/')
                    })
                })
            } else {
              image
                .save()
                .then(savedTweet => {
                  res.redirect('/')
                })
            }
          })
      })
      .catch(err => {
        res.render('images/edit', {
          message: err.message,
          id: imageId
        })
      })
  },
  deleteGet: (req, res) => {
    let imageId = req.params.id

    Image
      .findById(imageId)
      .then(image => {
        res.render('images/delete', {
          description: image.description,
          image: image.image,
          id: image._id
        })
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  },
  deletePost: (req, res) => {
    let imageId = req.params.id
    let description = req.body.description
    let url = req.body.url

    Image
      .findById(imageId)
      .then(image => {
        deleteHandlers(image._id)
        .then(() => {
          image
          .remove()
          .then(removedImage => {
            console.log('Image ' + removedImage._id + ' was removed!')
            res.redirect('/')
          })
        })
      })
      .catch(err => {
        console.log('Failed to remove tweet ' + imageId)
        res.render('images/delete', {
          description: description,
          image: url,
          id: imageId
        })
      })
  },
  like: (req, res) => {
    let imageId = req.params.id
    let userId = req.user.id
    let query = req.query.url

    likesUpdater.like(imageId, userId)
      .then(() => {
        res.redirect(query)
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  },
  dislike: (req, res) => {
    let imageId = req.params.id
    let userId = req.user.id
    let query = req.query.url

    likesUpdater.dislike(imageId, userId)
      .then(() => {
        res.redirect(query)
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  }
}
