const Post = require('../data/Post')
const Thread = require('../data/Thread')

function updateLastComment(threadId) {
  return new Promise((resolve, reject) => {
    Thread
      .findById(threadId)
        .then(thread => {
          Post
            .find({})
            .where('thread').equals(threadId)
            .sort('-date')
            .limit(1)
            .then(post => {
              if (post.length > 0) {
                thread.lastAnswer = post[0].date
              } else {
                thread.lastAnswer = new Date(0)
              }
              thread
                .save()
                .then(thread => {
                  resolve(thread)
                })
            })
        })
  })
}


module.exports = {
  addGet: (req, res) => {
    let user = req.user
    let threadId = req.params.id

    Thread
      .findById(threadId)
      .populate('author')
      .then(thread => {
        thread.views += 1
        thread
          .save()
          .then(updThread => {
            Post
              .find({})
              .where('thread').equals(threadId)
              .sort('-date')
              .populate('author')
              .then(posts => {
                let isAdmin = false
                if (user.roles.indexOf('Admin') >= 0) {
                  isAdmin = true
                }
                res.render('posts/add', {
                  isAdmin: isAdmin,
                  thread: updThread,
                  posts: posts
                })
              })
              .catch(err => {
                console.log(err)
                res.locals.globalError = err
                res.redirect('/')
              })
          })
      })
      .catch(err => {
        console.log(err)
        res.locals.globalError = "Can't find thread!"
        res.redirect('/')
      })
  },
  addPost: (req, res) => {
    let threadId = req.params.id
    let userId = req.user._id
    let postReq = req.body

    Thread
      .findById(threadId)
      .then(thread => {
        Post
          .create({
            text: postReq.text,
            author: userId,
            thread: threadId
          })
          .then(post => {
            thread.lastAnswer = post.date
            thread
              .save()
              .then(updThread => {
                res.redirect('/post/' + thread._id + '/' + thread.title)
              })
              .catch(err => {
                console.log(err)
                res.locals.globalError = err
                res.redirect('/')
              })
              .catch(err => {
                res.locals.globalError = err
                res.redirect('/')
              })
          })
          .catch(err => {
            console.log(err)
            res.locals.globalError = err
            res.redirect('/')
          })
      })
      .catch(err => {
        console.log(err)
        res.locals.globalError = err
        res.redirect('/')
      })
  },
  deleteGet: (req, res) => {
    let postId = req.params.id

    Post
      .findById(postId)
      .then(post => {
        res.render('posts/delete', {
          id: post._id,
          text: post.text
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  deletePost: (req, res) => {
    let postId = req.params.id

    Post
      .findById(postId)
      .then(post => {
        post
          .remove()
          .then(removedPost => {
            updateLastComment(removedPost.thread)
            .then(thread => {
              res.redirect('/post/' + thread._id + '/' + thread.title)
            })
            .catch(err => {
              console.log(err)
              res.redirect('/')
            })
          })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  editGet: (req, res) => {
    let postId = req.params.id

    Post
      .findById(postId)
      .then(post => {
        res.render('posts/edit', {
          id: post._id,
          text: post.text
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  editPost: (req, res) => {
    let postId = req.params.id
    let postReq = req.body

    Post
      .findById(postId)
      .then(post => {
        post.text = postReq.text
        post.date = Date.now()

        post
          .save()
          .then(editedPost => {
            updateLastComment(editedPost.thread)
            .then(thread => {
              res.redirect('/post/' + thread._id + '/' + thread.title)
            })
            .catch(err => {
              console.log(err)
              res.redirect('/')
            })
          })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  }
}
