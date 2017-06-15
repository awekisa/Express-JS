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
  app.get('/profile/:id', auth.isAuthenticated, controllers.users.profile)
  app.get('/list', controllers.home.list)

  app.get('/admin-all', auth.isInRole('Admin'), controllers.admins.all)
  app.get('/admin-add', auth.isInRole('Admin'), controllers.admins.addAdminGet)
  app.post('/admin-add/:id', auth.isInRole('Admin'), controllers.admins.addAdminPost)
  app.post('/admin-remove/:id', auth.isInRole('Admin'), controllers.admins.removeAdminPost)

  app.get('/thread/add', auth.isAuthenticated, controllers.threads.addGet)
  app.post('/thread/add', auth.isAuthenticated, controllers.threads.addPost)
  app.get('/thread-delete/:id', auth.isInRole('Admin'), controllers.threads.deleteGet)
  app.post('/thread-delete/:id', auth.isInRole('Admin'), controllers.threads.deletePost)
  app.get('/thread-edit/:id', auth.isInRole('Admin'), controllers.threads.editGet)
  app.post('/thread-edit/:id', auth.isInRole('Admin'), controllers.threads.editPost)

  app.get('/post/:id/:title', auth.isAuthenticated, controllers.posts.addGet)
  app.post('/post/:id/:title', auth.isAuthenticated, controllers.posts.addPost)
  app.get('/post-delete/:id', auth.isInRole('Admin'), controllers.posts.deleteGet)
  app.post('/post-delete/:id', auth.isInRole('Admin'), controllers.posts.deletePost)
  app.get('/post-edit/:id', auth.isInRole('Admin'), controllers.posts.editGet)
  app.post('/post-edit/:id', auth.isInRole('Admin'), controllers.posts.editPost)

  app.get('/like/:id', auth.isAuthenticated, controllers.threads.like)
  app.get('/dislike/:id', auth.isAuthenticated, controllers.threads.dislike)

  app.get('/category-add', auth.isInRole('Admin'), controllers.categories.addGet)
  app.post('/category-add', auth.isInRole('Admin'), controllers.categories.addPost)
  app.get('/categories', controllers.categories.list)
  app.get('/list/:category', controllers.categories.showSpecific)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 not found!')
    res.end()
  })
}
