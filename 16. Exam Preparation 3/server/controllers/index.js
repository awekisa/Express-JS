const home = require('./home-controller')
const users = require('./users-controler')
const admins = require('./admin-controller')
const tags = require('./tag-controller')
const images = require('./image-controller.js')

module.exports = {
  home: home,
  users: users,
  admins: admins,
  images: images,
  tags: tags
}
