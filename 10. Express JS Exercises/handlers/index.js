const homeHandler = require('./home')
const gameHandler = require('./game')
const genreHandler = require('./genre')

module.exports = {
  home: homeHandler,
  game: gameHandler,
  genre: genreHandler
}
