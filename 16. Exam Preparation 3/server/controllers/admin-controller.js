const User = require('../data/User')

module.exports = {
  all: (req, res) => {
    User
      .find({})
      .then(users => {
        users = users.filter(u => {
          if (u.roles.indexOf('Admin') >= 0) {
            u.isAdmin = true
            return u
          }
          return u
        })
        res.render('admins/all', {
          users: users
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  addAdminGet: (req, res) => {
    User
      .find({})
      .then(users => {
        let admins = users.filter(u => {
          if (u.roles.indexOf('Admin') >= 0) {
            return u
          }
        })
        res.render('admins/add', {
          admins: admins
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
  },
  addAdminPost: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(user => {
        user.roles.push('Admin')
        user
          .save()
          .then(admin => {
            res.redirect('/admin-all')
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
  removeAdminPost: (req, res) => {
    let userId = req.params.id

    User
      .findById(userId)
      .then(user => {
        let adminRoleIndex = user.roles.indexOf('Admin')
        user.roles.splice(adminRoleIndex)
        user
          .save()
          .then(savedUser => {
            res.redirect('/admin-all')
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
