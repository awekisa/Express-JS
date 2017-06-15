const encryption = require('../utilities/encryption')
const User = require('../data/User')
const Thread = require('../data/Thread')
const Post = require('../data/Post')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then((user) => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({ username: reqUser.username }).then((user) => {
      if (!user) {
        res.locals.globalError = 'Invalid user data!'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data!'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
          return
        }
        res.redirect('/')
      })
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  profile: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(author => {
        Thread
          .find({})
          .where('author').equals(userId)
          .then(threads => {
            Post
              .find({})
              .populate('thread')
              .where('author').equals(userId)
              .then(posts => {
                res.render('users/profile', {
                  author: author,
                  threads: threads,
                  posts: posts
                })
              })
              .catch(err => {
                console.log(err)
                res.redirect('/')
              })
          .catch(err => {
            console.log(err)
            res.redirect('/')
          })
          })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  }
}
