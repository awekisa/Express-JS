const Tweet = require('../data/Tweet')

module.exports = (tweets) => {
  return new Promise((resolve, reject) => {
    let promises = []
    for (let tweet of tweets) {
      let promise = new Promise((resolve, reject) => {
        tweet.views += 1
        tweet
          .save()
          .then((savedTweet) => {
            resolve(savedTweet)
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
