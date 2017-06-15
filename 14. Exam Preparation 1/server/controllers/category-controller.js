const Category = require('../data/Category')
const Thread = require('../data/Thread')

module.exports = {
  addGet: (req, res) => {
    res.render('categories/add')
  },
  addPost: (req, res) => {
    let categoryReq = req.body

    Category
      .create({
        name: categoryReq.name
      })
      .then(() => {
        res.redirect('/')
      })
  },
  list: (req, res) => {
    Category
      .find({})
      .then(categories => {
        res.render('categories/all', {
          categories: categories
        })
      })
  },
  showSpecific: (req, res) => {
    let categoryName = req.params.category

    Category
      .find({name: categoryName})
      .then(category => {
        Thread
          .find({})
          .where('category').equals(category[0]._id)
          .populate('category')
          .then(threads => {
            res.render('threads/show-by-category', {
              threads: threads
            })
          })
      })
  }
}
