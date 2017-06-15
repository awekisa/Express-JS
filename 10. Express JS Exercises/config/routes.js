const handlers = require('../handlers')
const multer = require('multer')

let upload = multer({dest: './content/images'})

module.exports = (app) => {
  app.get('/', handlers.home.index)

  app.get('/game/add', handlers.game.addGet)
  app.post('/game/add', upload.single('logo'), handlers.game.addPost)

  app.get('/genre/add', handlers.genre.addGet)
  app.post('/genre/add', handlers.genre.addPost)

  app.get('/genre/:genre/games', handlers.genre.gameByGenre)

  app.get('/game/edit/:id', handlers.game.editGet)
  app.post('/game/edit/:id', upload.single('logo'), handlers.game.editPost)

  app.get('/game/delete/:id', handlers.game.deleteGet)
  app.post('/game/delete/:id', handlers.game.deletePost)
}
