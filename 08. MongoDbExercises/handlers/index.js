const homeHandler = require('./home')
const filesHandler = require('./static-files')
const formHandler = require('./form')
const searchByTag = require('./search-by-tag')
const searchByDate = require('./search-by-date')

module.exports = [homeHandler, formHandler, searchByTag, searchByDate, filesHandler]
