const mongoose = require('mongoose')

let genreSchema = mongoose.Schema({
  name: {type: mongoose.Schema.Types.String, require: true, unique: true},
  games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}]
})

let Genre = mongoose.model('Genre', genreSchema)

module.exports = Genre
