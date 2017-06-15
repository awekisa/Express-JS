const mongoose = require('mongoose')
const Article = require('../data/Article')
const errorHandler = require('../utilities/error-handler')
const auth = require('../config/auth')

module.exports = {
  addGet: (req, res) => {
    res.render('articles/add')
  },
  addPost: (req, res) => {
    let articleReq = req.body
    let authorId = req.user

    Article
      .create({
        title: articleReq.title,
        author: authorId,
        description: articleReq.description,
        content: articleReq.content
      })
      .then(article => {
        res.redirect('/articles/list')
      })
      .catch((err) => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('articles/add', articleReq)
      })
  },
  list: (req, res) => {
    let sessionUser = null
    if (req._passport.session) {
      sessionUser = req._passport.session.user
    }
    let pageSize = 5
    let page = parseInt(req.query.page) || 1
    let search = req.query.search
    let numbersOnPage = page * pageSize - pageSize + 1

    let query = Article.find({})

    if (search) {
      query = query.where('title').regex(new RegExp(search, 'i'))
    }

    query
      .sort('-date')
      .populate('author')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(articles => {
        articles.forEach(a => {
          a.enableEdit = false
          a.enableDelete = false
          if (sessionUser) {
            if (sessionUser === a.author._id.toString() || req.user.roles.indexOf('Admin') > -1) {
              a.enableEdit = true
            }
            if (req.user.roles.indexOf('Admin') > -1) {
              a.enableDelete = true
            }
          }
          a.num = numbersOnPage++
          return a
        })
        res.render('articles/list', {
          articles: articles,
          hasPrevPage: page > 1,
          hasNextPage: articles.length > 0,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
      .catch(err => {
        res.locals.globalError = err
        res.render('articles/add')
      })
  },
  details: (req, res) => {
    let articleId = req.params.id

    Article
      .findById(articleId)
      .populate('author')
      .then(article => {
        res.render('articles/details/', article)
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('articles/list')
      })
  },
  editGet: (req, res) => {
    let articleId = req.params.id

    Article
      .findById(articleId)
      .then(article => {
        res.render('articles/edit/', {
          id: articleId,
          title: article.title,
          description: article.description,
          content: article.content
        })
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('articles/list')
      })
  },
  editPost: (req, res) => {
    let editedArticle = req.body
    let articleId = req.params.id

    Article
      .findById(articleId)
      .then(article => {
        article.title = editedArticle.title
        article.description = editedArticle.description
        article.content = editedArticle.content

        article
          .save()
          .then(savedArticle => {
            res.redirect('/articles/list')
          })
          .catch(err => {
            res.locals.globalError = err
            res.render('articles/list')
          })
      })
      .catch(err => {
        res.locals.globalError = err
        res.render('articles/list')
      })
  },
  deleteGet: (req, res) => {
    let articleId = req.params.id

    Article
      .findById(articleId)
      .then(article => {
        res.render('articles/delete/', {
          id: articleId,
          title: article.title,
          description: article.description,
          content: article.content
        })
      })
      .catch(err => {
        res.locals.globalError = err
        res.render('articles/list')
      })
  },
  deletePost: (req, res) => {
    let articleId = req.params.id

    Article
      .findById(articleId)
      .remove()
      .then(article => {
        res.redirect('/articles/list')
      })
      .catch(err => {
        res.locals.globalError = err
        res.render('articles/list')
      })
  }
}

