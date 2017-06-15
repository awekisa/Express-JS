const encryption = require('../utilities/encryption')
const User = require('../data/User')
const Image = require('../data/Image')
const Handler = require('../data/Handler')
const errorHandler = require('../utilities/error-handler')
const ImageViewsUpdater = require('../utilities/update-instagram-views')

function findsImagesByHandlers(handlers, authorsImages) {
  return new Promise((resolve, reject) => {
    let imagePromises = []
    let handlerImages = []
    let authorsImagesIds = authorsImages.map(e => {
      return e._id.toString()
    })
    for (let handler of handlers) {
      let promise = new Promise((resolve, reject) => {
        Image
          .findById(handler.image)
          .populate('author')
          .then(image => {
            if (authorsImagesIds.indexOf(image._id.toString()) < 0) {
              handlerImages.push(image)
            }
            resolve(image)
          })
      })
      imagePromises.push(promise)
    }
    Promise.all(imagePromises)
      .then(() => {
        let arr = handlerImages.concat(authorsImages)
        arr.sort((a, b) => {
          return b.date - a.date
        })
        console.log(arr)
        resolve(arr)
      })
  })
}

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then((user) => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({ username: reqUser.username }).then((user) => {
      if (!user) {
        res.locals.globalError = 'Invalid user data!'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data!'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
          return
        }
        res.redirect('/')
      })
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  allImages: (req, res) => {
    let username = req.params.username
    let pageSize = 100
    let page = parseInt(req.query.page) || 1

    User
      .findOne({username: username})
      .then(user => {
        Image
          .find({})
          .where('author').equals(user._id)
          .sort('-date')
          .populate('author')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .then(images => {
            Handler
              .find({})
              .where('user').equals(user._id)
              .then(handlers => {
                findsImagesByHandlers(handlers, images)
                  .then(newImages => {
                    ImageViewsUpdater(newImages)
                      .then(() => {
                        if (req.user) {
                          newImages.forEach(i => {
                            i.isLiked = false
                            if (i.likes.indexOf(req.user._id) >= 0) {
                              i.isLiked = true
                            }
                          })
                        }
                        res.render('users/profile', {
                          author: user.username,
                          query: '/profile/' + username,
                          images: newImages,
                          isAdmin: res.locals.isAdmin,
                          hasPrevPage: page > 1,
                          hasNextPage: newImages.length === pageSize,
                          prevPage: page - 1,
                          nextPage: page + 1
                        })
                      })
                      .catch((err) => {
                        console.log(err)
                        res.redirect('/')
                      })
                  })
              })
          })
      })
      .catch(err => {
        let errMsg = errorHandler.handleSingleError(err)
        res.locals.globalError = errMsg
        res.redirect('/')
      })
  }
}
