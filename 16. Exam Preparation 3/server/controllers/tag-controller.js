const Image = require('../data/Image')
const errorHandler = require('../utilities/error-handler')
const ImageViewsUpdater = require('../utilities/update-instagram-views')

module.exports = {
  showImages: (req, res) => {
    let tagName = req.params.tag
    let pageSize = 100
    let page = parseInt(req.query.page) || 1
    let query = req.query.url

    Image
      .find({})
      .populate('author')
      .sort('-date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(foundImages => {
        let images = []
        for (let item of foundImages) {
          if (item.tags.indexOf(tagName) >= 0) {
            images.push(item)
          }
        }
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
            res.render('images/show-by-tag', {
              query: '/tags/' + tagName,
              tag: tagName,
              images: images,
              isAdmin: res.locals.isAdmin,
              hasPrevPage: page > 1,
              hasNextPage: images.length === pageSize,
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
