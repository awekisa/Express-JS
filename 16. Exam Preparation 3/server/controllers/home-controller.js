const Image = require('../data/Image')
const ImageViewsUpdater = require('../utilities/update-instagram-views')

module.exports = {
  index: (req, res) => {
    let pageSize = 100
    let page = parseInt(req.query.page) || 1

    Image
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort('-date')
      .populate('author')
      .then(images => {
        ImageViewsUpdater(images)
          .then(() => {
            if (req.user) {
              images.forEach(t => {
                t.isLiked = false
                if (t.likes.indexOf(req.user._id) >= 0) {
                  t.isLiked = true
                }
              })
            }
            res.render('home/index', {
              query: '/',
              images: images,
              isAdmin: res.locals.isAdmin,
              hasPrevPage: page > 1,
              hasNextPage: images.length === pageSize,
              prevPage: page - 1,
              nextPage: page + 1
            })
          })
      })
      .catch((err) => {
        res.render('errors/', {
          message: err.message
        })
      })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
