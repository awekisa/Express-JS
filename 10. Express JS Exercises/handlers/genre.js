const Genre = require('../models/Genre')
const Game = require('../models/Game')

module.exports.addGet = (req, res) => {
  res.render('genre/add')
}

module.exports.addPost = (req, res) => {
  let genre = req.body
  Genre.create(genre).then(() => {
    res.redirect('/')
  })
}

module.exports.gameByGenre = (req, res) => {
  let genreName = req.params.genre

  Genre.findOne({name: genreName})
    .populate('games')
    .then((genre) => {
      if (!genre) {
        res.sendStatus(404)
        return
      }

      res.render('genre/games', {genre: genre})
    })
}
