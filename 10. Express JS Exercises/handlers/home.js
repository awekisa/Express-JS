const Game = require('../models/Game')

module.exports.index = (req, res) => {
  let queryData = req.query

  Game.find().populate('genre').then((games) => {
    if (queryData.query) {
      games = games.filter(
        game => game.name.toLowerCase()
        .includes(queryData.query))
    }


    let data = {games: games}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }

    res.render('home/index', data)
  })
}
