const encryption = require('../utilities/encryption')
const User = require('../data/User')
const Tweet = require('../data/Tweet')
const Handler = require('../data/Handler')
const errorHandler = require('../utilities/error-handler')
const TweetViewsUpdater = require('../utilities/update-tweet-views')

function findsTweetsByHandlers(handlers, authorsTweets) {
  return new Promise((resolve, reject) => {
    let tweetPromise = []
    let handlerTweets = []
    let authorsTweetsIds = authorsTweets.map(e => {
      return e._id.toString()
    })
    for (let handler of handlers) {
      console.log(handler.tweet.toString())
      let promise = new Promise((resolve, reject) => {
        Tweet
          .findById(handler.tweet)
          .populate('author')
          .then(tweet => {
            if (authorsTweetsIds.indexOf(tweet._id.toString()) < 0) {
              handlerTweets.push(tweet)
            }
            resolve(tweet)
          })
      })
      tweetPromise.push(promise)
    }
    Promise.all(tweetPromise)
      .then(() => {
        let arr = handlerTweets.concat(authorsTweets)
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
  allTweets: (req, res) => {
    let username = req.params.username
    let pageSize = 100
    let page = parseInt(req.query.page) || 1

    User
      .findOne({username: username})
      .then(user => {
        Tweet
          .find({})
          .where('author').equals(user._id)
          .sort('-date')
          .populate('author')
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .then(tweets => {
            Handler
              .find({})
              .where('user').equals(user._id)
              .then(handlers => {
                findsTweetsByHandlers(handlers, tweets)
                  .then(newTweets => {
                    TweetViewsUpdater(newTweets)
                      .then(() => {
                        if (req.user) {
                          newTweets.forEach(t => {
                            t.isLiked = false
                            if (t.likes.indexOf(req.user._id) >= 0) {
                              t.isLiked = true
                            }
                          })
                        }
                        res.render('users/profile', {
                          tweets: newTweets,
                          isAdmin: res.locals.isAdmin,
                          hasPrevPage: page > 1,
                          hasNextPage: newTweets.length === pageSize,
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
