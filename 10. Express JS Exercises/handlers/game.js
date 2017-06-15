const Game = require('../models/Game')
const Genre = require('../models/Genre')
const fs = require('fs')
const path = require('path')

module.exports.addGet = (req, res) => {
  Genre.find().then((genres) => {
    res.render('game/add', {genres: genres})
  })
}

module.exports.addPost = (req, res) => {
  let gameObj = req.body
  gameObj.logo = '\\' + req.file.path
  Game.create(gameObj).then((game) => {
    Genre.findById(game.genre).then((genre) => {
      genre.games.push(game._id)
      genre.save()
    })
    res.redirect('/')
  })
}


module.exports.editGet = (req, res) => {
  let id = req.params.id
  Game.findById(id).then(game => {
    if (!game) {
      res.sendStatus(404)
      return
    }

    Genre.find().then((genres) => {
      res.render('game/edit', {
        game: game,
        genres: genres
      })
    })
  })
}

module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedGame = req.body

  Game.findById(id).then((game) => {
    if (!game) {
      res.redirect(
        `/?error=${encodeURIComponent('error=Game was not found!')}`)
      return
    }

    game.name = editedGame.name
    game.description = editedGame.description

    if (req.file) {
      game.logo = '\\' + req.file.path
    }

    // First we check if the category is changed
    if (game.genre.toString() !== editedGame.genre) {
      // If so find the "current" and "next" category.
      Genre.findById(game.genre).then((currentGenre) => {
        Genre.findById(editedGame.genre).then((nextGenre) => {
          let index = currentGenre.games.indexOf(game._id)
          if (index >= 0) {
            // Remove product specified from current categiry's list of products

            currentGenre.games.splice(index, 1)
          }
          currentGenre.save()

          // Add product's reference to the "new" category.
          nextGenre.games.push(game._id)
          nextGenre.save()

          game.genre = editedGame.genre

          game.save().then(() => {
            res.redirect(
              '/?success=' + encodeURIComponent('Game was edited successfully!'))
          })
        })
      })
    } else {
      game.save().then(() => {
        res.redirect(
          `/?success` + encodeURIComponent('Game was edited successfully!'))
      })
    }
  })
}


module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Game.findById(id).then(game => {
    if (!game) {
      res.sendStatus(404)
      return
    }

    res.render('game/delete', {
      game: game
    })
  })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id

  Game.findById(id).then((game) => {
    if (!game) {
      res.redirect(
        `/?error=${encodeURIComponent('error=Game was not found!')}`)
      return
    }
      // If so find the "current" and "next" category.
    Genre.findById(game.genre).then((genre) => {
      let logoPath = game.logo
      let index = genre.games.indexOf(game._id)
      if (index >= 0) {
        // Remove product specified from current categiry's list of product
        genre.games.splice(index, 1)
      }
      genre.save()
      Game.findByIdAndRemove(id).then(() => {
        fs.unlink(path.join('.', logoPath), () => {
          res.redirect(
          '/?success=' + encodeURIComponent('Game was removed successfully!'))
        })
      })
    })
  })
}

