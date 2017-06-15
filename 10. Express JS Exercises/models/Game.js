const mongoose = require('mongoose')

let gameSchema = mongoose.Schema({
  name: {type: mongoose.Schema.Types.String, required: true},
  description: {type: mongoose.Schema.Types.String},
  logo: {type: mongoose.Schema.Types.String},
  genre: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}
})

let Game = mongoose.model('Game', gameSchema)

module.exports = Game
