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

  app.get('/articles/add', auth.isAuthenticated, controllers.articles.addGet)
  app.post('/articles/add', auth.isAuthenticated, controllers.articles.addPost)
  app.get('/articles/list', controllers.articles.list)
  app.get('/articles/details/:id', auth.isAuthenticated, controllers.articles.details)
  app.get('/articles/edit/:id', auth.isAuthenticated, controllers.articles.editGet)
  app.post('/articles/edit/:id', auth.isAuthenticated, controllers.articles.editPost)
  app.get('/articles/delete/:id', auth.isAuthenticated, controllers.articles.deleteGet)
  app.post('/articles/delete/:id', auth.isAuthenticated, controllers.articles.deletePost)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 not found!')
    res.end()
  })
}
