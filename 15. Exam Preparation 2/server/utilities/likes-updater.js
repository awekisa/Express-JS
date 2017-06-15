const Tweet = require('../data/Tweet')

module.exports = {
  like: (tweetId, userId) => {
    return new Promise((resolve, reject) => {
      Tweet
      .findById(tweetId)
      .then(tweet => {
        if (tweet.likes.indexOf(userId) >= 0) {
          reject(new Error('Tweet is already liked by that user!'))
        } else {
          tweet.likes.push(userId)
          tweet
            .save()
            .then(() => {
              resolve('Tweet liked!')
            })
        }
      })
      .catch(() => {
        reject(new Error('Tweet not found!'))
      })
    })
  },
  dislike: (tweetId, userId) => {
    return new Promise((resolve, reject) => {
      Tweet
      .findById(tweetId)
      .then(tweet => {
        let index = tweet.likes.indexOf(userId)
        if (index < 0) {
          reject(new Error('Tweet is not liked by that user'))
        } else {
          tweet.likes.splice(index, 1)
          tweet
            .save()
            .then(() => {
              resolve('Tweet is disliked')
            })
        }
      })
      .catch(() => {
        reject(new Error('Tweet not found!'))
      })
    })
  }
}
