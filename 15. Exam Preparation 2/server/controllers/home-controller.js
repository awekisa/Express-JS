const Tweet = require('../data/Tweet')
const TweetViewsUpdater = require('../utilities/update-tweet-views')

module.exports = {
  index: (req, res) => {
    let pageSize = 100
    let page = parseInt(req.query.page) || 1

    Tweet
      .find({})
      .populate('author')
      .sort('-date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(tweets => {
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
            res.render('home/index', {
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
        console.log(err)
      })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
