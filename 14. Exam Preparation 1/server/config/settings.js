const path = require('path')

let rootPath = (path.normalize(path.join(__dirname, '../../')))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/exam-prep-1',
    port: 3000
  },
  staging: {

  },
  prodction: {
    port: process.env.PORT
  }
}


