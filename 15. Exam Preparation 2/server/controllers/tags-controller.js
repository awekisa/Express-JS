const Tweet = require('../data/Tweet')
const errorHandler = require('../utilities/error-handler')
const TweetViewsUpdater = require('../utilities/update-tweet-views')

module.exports = {
  showTweets: (req, res) => {
    let tagName = req.params.tag
    let pageSize = 100
    let page = parseInt(req.query.page) || 1

    Tweet
      .find({})
      .populate('author')
      .sort('-date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(foundTweets => {
        let tweets = []
        for (let item of foundTweets) {
          if (item.tags.indexOf(tagName) >= 0) {
            tweets.push(item)
          }
        }
        TweetViewsUpdater(tweets)
          .then(() => {
            if (req.user) {
              tweets.forEach(t => {
                t.isLiked = false
                if (t.likes.indexOf(req.user._id) >= 0) {
                  t.isLiked = true
                }
              })
            }
            res.render('tweets/show-by-tag', {
              tweets: tweets,
              isAdmin: res.locals.isAdmin,
              hasPrevPage: page > 1,
              hasNextPage: tweets.length === pageSize,
              prevPage: page - 1,
              nextPage: page + 1
            })
          })
          .catch((err) => {
            console.log(err)
            res.redirect('/')
          })
      })
      .catch(err => {
        let errMsg = errorHandler.handleSingleError(err)
        res.locals.globalError = errMsg
        res.redirect('/')
      })
  }
}
