const controllers = require('../controllers/index')
const auth = require('./auth')


module.exports = (app) => {
  app.get('/', controllers.home.index)
  // this is how to make page for auth users only
  app.get('/about', auth.isAuthenticated, controllers.home.about)
  // this is how to make page for admin only
  app.get('/about', auth.isInRole('Admin'), controllers.home.about)
  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)

  // admins
  app.get('/admin-all', auth.isInRole('Admin'), controllers.admins.all)
  app.get('/admin-add', auth.isInRole('Admin'), controllers.admins.addAdminGet)
  app.post('/admin-add/:id', auth.isInRole('Admin'), controllers.admins.addAdminPost)
  app.post('/admin-remove/:id', auth.isInRole('Admin'), controllers.admins.removeAdminPost)

  app.get('/tweet', auth.isAuthenticated, controllers.tweets.addGet)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.addPost)
  app.get('/tweet-edit/:id', auth.isInRole('Admin'), controllers.tweets.editGet)
  app.post('/tweet-edit/:id', auth.isInRole('Admin'), controllers.tweets.editPost)
  app.get('/tweet-delete/:id', auth.isInRole('Admin'), controllers.tweets.deleteGet)
  app.post('/tweet-delete/:id', auth.isInRole('Admin'), controllers.tweets.deletePost)

  app.get('/tags/:tag', controllers.tags.showTweets)

  app.get('/profile/:username', auth.isAuthenticated, controllers.users.allTweets)

  app.get('/like/:id', auth.isAuthenticated, controllers.tweets.like)
  app.get('/dislike/:id', auth.isAuthenticated, controllers.tweets.dislike)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 not found!')
    res.end()
  })
}
