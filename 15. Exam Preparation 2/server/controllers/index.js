const home = require('./home-controller')
const users = require('./users-controler')
const tweets = require('./tweet-controller')
const tags = require('./tags-controller')
const admins = require('./admin-controller')

module.exports = {
  home: home,
  users: users,
  tweets: tweets,
  tags: tags,
  admins: admins
}
