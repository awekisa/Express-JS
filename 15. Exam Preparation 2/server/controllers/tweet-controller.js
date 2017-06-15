const Tweet = require('../data/Tweet')
const User = require('../data/User')
const Handler = require('../data/Handler')
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
  let handlers = []
  for (let str of arr) {
    if (str.search('@') === 0) {
      str = str.substring(1)
      if (!/@/.test(str)) {
        handlers.push(str)
      }
    }
  }
  return handlers.filter(String)
}

function createHandlers (handlers, tweetId) {
  let handlersPromise = []
  for (let handler of handlers) {
    let promise = new Promise((resolve, reject) => {
      User
        .findOne({username: handler})
        .then(user => {
          Handler
            .create({
              user: user._id,
              tweet: tweetId
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

function deleteHandlers(tweetId) {
  return new Promise((resolve, reject) => {
    Handler
      .find({tweet: tweetId})
      .then(tweets => {
        let deletePromises = []
        for (let tweet of tweets) {
          let delPromise = new Promise((resolve, reject) => {
            tweet
              .remove()
              .then(remTweet => {
                resolve(remTweet)
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
    res.render('tweets/add')
  },
  addPost: (req, res) => {
    let message = req.body.message
    let userId = req.user.id

    let msgArray = message.split(/[\s,.!?]/).filter(String)
    let tags = parseTags(msgArray)
    let handlers = parseHandlers(msgArray)

    Tweet.create({
      message: message,
      author: userId,
      tags: tags
    })
    .then(tweet => {
      if (handlers.length > 0) {
        let handleCreaterArr = createHandlers(handlers, tweet._id)
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
      res.render('tweets/add')
    })
  },
  editGet: (req, res) => {
    let tweetId = req.params.id

    Tweet
      .findById(tweetId)
      .then(tweet => {
        res.render('tweets/edit', {
          message: tweet.message,
          id: tweet._id
        })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleSingleError(err)
        res.render('/')
      })
  },
  editPost: (req, res) => {
    let tweetId = req.params.id
    let message = req.body.message
    let msgArray = message.split(/[\s,.!?]/).filter(String)
    let tags = parseTags(msgArray)
    let handlers = parseHandlers(msgArray)

    Tweet
      .findById(tweetId)
      .then(tweet => {
        deleteHandlers(tweet._id)
          .then(() => {
            if (handlers.length > 0) {
              let handleCreaterArr = createHandlers(handlers, tweet._id)
              Promise.all(handleCreaterArr)
                .then(() => {
                  console.log('Handlers created!')
                  tweet.message = message
                  tweet.tags = tags
                  tweet
                    .save()
                    .then(savedTweet => {
                      res.redirect('/')
                    })
                })
            } else {
              tweet.message = message
              tweet.tags = tags
              tweet
                .save()
                .then(savedTweet => {
                  res.redirect('/')
                })
            }
          })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleSingleError(err)
        res.render('tweets/edit', {
          message: message,
          id: tweetId
        })
      })
  },
  deleteGet: (req, res) => {
    let tweetId = req.params.id

    Tweet
      .findById(tweetId)
      .then(tweet => {
        res.render('tweets/delete', {
          message: tweet.message,
          id: tweet._id
        })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleSingleError(err)
        res.render('/')
      })
  },
  deletePost: (req, res) => {
    let tweetId = req.params.id
    let message = req.body.message

    Tweet
      .findById(tweetId)
      .then(tweet => {
        deleteHandlers(tweet._id)
        .then(() => {
          tweet
          .remove()
          .then(removedTweet => {
            console.log('Tweet ' + removedTweet._id + ' was removed!')
            res.redirect('/')
          })
        })
      })
      .catch(err => {
        res.locals.globalError = errorHandler.handleSingleError(err)
        console.log('Failed to remove tweet ' + tweetId)
        res.render('tweets/delete', {
          message: message,
          id: tweetId
        })
      })
  },
  like: (req, res) => {
    let tweetId = req.params.id
    let userId = req.user.id

    likesUpdater.like(tweetId, userId)
      .then(() => {
        res.redirect('/')
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  },
  dislike: (req, res) => {
    let tweetId = req.params.id
    let userId = req.user.id

    likesUpdater.dislike(tweetId, userId)
      .then(() => {
        res.redirect('/')
      })
      .catch(err => {
        res.render('errors/', {
          message: err.message
        })
      })
  }
}
