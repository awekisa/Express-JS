const homeHandled = require('./home')
const formHandler = require('./form')
const staticFilesHandler = require('./static-files')

module.exports = [homeHandled, formHandler, staticFilesHandler]
