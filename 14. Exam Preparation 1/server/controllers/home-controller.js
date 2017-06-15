const Thread = require('../data/Thread')

module.exports = {
  index: (req, res) => {
    let pageSize = 20
    let page = parseInt(req.query.page) || 1
    let search = req.query.search


    let query = Thread.find({})

    if (search) {
      query = query.where('title').regex(new RegExp(search, 'i'))
    }


    query
      .sort('-lastAnswer')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('author')
      .then(threads => {
        for (let tr of threads) {
          if (req.user) {
            let index = tr.likes.indexOf(req.user._id)
            tr.isLiked = index >= 0
          } else {
            tr.isLiked = false
          }
        }
        res.render('home/', {
          threads: threads,
          hasPrevPage: page > 1,
          hasNextPage: threads.length === pageSize,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
      .catch(err => {
        res.locals.globalError = err
        res.redirect('/threads/add')
      })
  },
  about: (req, res) => {
    res.render('home/about')
  },
  list: (req, res) => {
    let search = req.query.search
    let query = Thread.find({})
    if (search) {
      query = query.where('title').regex(new RegExp(search, 'i'))
    }
    query
      .sort('lastAnswer')
      .populate('author')
      .then(threads => {
        res.render('home/list', {
          threads: threads,
          search: search
        })
      })
      .catch(err => {
        res.locals.globalError = err
        res.redirect('/threads/add')
      })
  }
}
