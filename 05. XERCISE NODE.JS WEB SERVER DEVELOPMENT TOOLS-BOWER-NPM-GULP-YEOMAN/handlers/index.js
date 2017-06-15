const homeHandler = require('./home')
const staticFiles = require('./static-files')
const formFiles = require('./form')
const imagesFiles = require('./images')
const statusHeader = require('./status')

module.exports = [statusHeader, homeHandler, formFiles, imagesFiles, staticFiles]
