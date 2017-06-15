const home = require('./home-controller')
const users = require('./users-controler')
const threads = require('./thread-controller')
const posts = require('./post-controller')
const admins = require('./admin-controller')
const categories = require('./category-controller')

module.exports = {
  home: home,
  users: users,
  threads: threads,
  posts: posts,
  admins: admins,
  categories: categories
}
