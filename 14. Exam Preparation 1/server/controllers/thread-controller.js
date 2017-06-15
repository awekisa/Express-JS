const Thread = require('../data/Thread')
const Post = require('../data/Post')
const User = require('../data/User')
const Category = require('../data/Category')

function deletePostsOfRemovedThread (threadId) {
  return new Promise((resolve, reject) => {
    Post
      .find({})
      .where('thread').equals(threadId)
      .then(posts => {
        let deletedPosts = []
        for (let post of posts) {
          let postPromise = new Promise((resolve, reject) => {
            post
              .remove()
              .then(removedPost => {
                resolve(removedPost)
              })
          })
          deletedPosts.push(postPromise)
        }
        Promise
          .all(deletedPosts)
          .then(() => {
            resolve(() => {
              console.log('Posts removed!')
            })
          })
      })
  })
}

module.exports = {
  addGet: (req, res) => {
    Category
      .find({})
      .then(categories => {
        res.render('threads/add', {
          categories: categories
        })
      })
  },
  addPost: (req, res) => {
    let threadReq = req.body
    let user = req.user

    Category
      .findOne({name: threadReq.category})
      .then(category => {
        Thread
          .create({
            title: threadReq.title,
            description: threadReq.description,
            category: category,
            author: user._id
          })
          .then(thread => {
            res.redirect('/')
          })
          .catch(err => {
            res.locals.globalError = err
            console.log(err)
            res.redirect('/thread/add')
          })
      })
  },
  deleteGet: (req, res) => {
    let threadId = req.params.id

    Thread
      .findById(threadId)
      .then(thread => {
        Category
          .find({})
          .then(categories => {
            for (let category of categories) {
              if (category._id.equals(thread.category)) {
                category.checked = true
              }
            }
            res.render('threads/delete', {
              id: threadId,
              title: thread.title,
              description: thread.description,
              categories: categories
            })
          })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  deletePost: (req, res) => {
    let threadId = req.params.id

    deletePostsOfRemovedThread(threadId)
      .then(() => {
        Thread
          .findById(threadId)
          .then(thread => {
            thread.remove()
              .then(() => {
                res.redirect('/')
              })
            .catch(err => {
              console.log(err)
              res.redirect('/post/' + thread._id + '/' + thread.title)
            })
          })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          })
      })
  },
  editGet: (req, res) => {
    let threadId = req.params.id

    Thread
      .findById(threadId)
      .then(thread => {
        Category
          .find({})
          .then(categories => {
            for (let category of categories) {
              if (category._id.equals(thread.category)) {
                category.checked = true
              }
            }
            res.render('threads/edit', {
              id: thread._id,
              title: thread.title,
              description: thread.description,
              categories: categories
            })
          })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  editPost: (req, res) => {
    let threadId = req.params.id
    let threadReq = req.body

    Thread
      .findById(threadId)
      .then(thread => {
        Category
          .findOne({name: threadReq.category})
          .then(category => {
            thread.title = threadReq.title
            thread.description = threadReq.description
            thread.category = category._id

            thread
              .save()
              .then(editedThread => {
                res.redirect('/post/' + editedThread._id + '/' + editedThread.title)
              })
              .catch(err => {
                console.log(err)
                res.redirect('/')
              })
          })
      })
  },
  like: (req, res) => {
    let threadId = req.params.id
    let userId = req.user._id

    Thread
      .findById(threadId)
      .then(thread => {
        User
          .findById(userId)
          .then(user => {
            thread.likes.push(user._id)
            thread
              .save()
              .then(() => {
                res.redirect('/')
              })
          })
      })
  },
  dislike: (req, res) => {
    let threadId = req.params.id
    let userId = req.user._id

    Thread
      .findById(threadId)
      .then(thread => {
        User
          .findById(userId)
          .then(user => {
            let likeIndex = thread.likes.indexOf(user._id)
            thread.likes.splice(likeIndex, 1)
            thread
              .save()
              .then(() => {
                res.redirect('/')
              })
          })
      })
  }
}

