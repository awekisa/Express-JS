let storage = {}
let fs = require('fs')

function put (key, value) {
  validateKeyIn(key)
  storage[key] = value
}

function get (key) {
  validateKeyOut(key)
  return storage[key]
}
function update (key, value) {
  validateKeyOut(key)
  storage[key] = value
}
function deleteItem (key) {
  validateKeyOut(key)
  delete storage[key]
}
function all () {
  return storage
}
function clear () {
  storage = {}
}
// synch save /load
function save () {
  let dataAsString = JSON.stringify(storage)
  fs.writeFileSync('storage.dat', dataAsString)
}
function load () {
  let dataAsString = fs.readFileSync('storage.dat', 'utf8')
  storage = JSON.parse(dataAsString)
}
// save/load with callbacks
let callbackSave = (callback) => {
  let dataAsString = JSON.stringify(storage)
  fs.writeFile('storage.dat', dataAsString, (err) => {
    if (err) {
      console.log(err)
      return
    }
    callback()
  })
}
let callbackLoad = (callback) => {
  fs.readFile('storage.dat', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    storage = JSON.parse(data)
    callback()
  })
}
let promiseSave = () => {
  return new Promise((resolve, reject) => {
    let dataAsString = JSON.stringify(storage)
    fs.writeFile('storage.dat', dataAsString, (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}
let promiseLoad = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('storage.dat', 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      storage = JSON.parse(data)
      resolve()
    })
  })
}

function validateKeyIn (key) {
  if (typeof key !== 'string') {
    throw new Error('Key is not a string')
  }
  if (storage.hasOwnProperty(key)) {
    throw new Error('The key already exist!')
  }
}
function validateKeyOut (key) {
  if (typeof key !== 'string') {
    throw new Error('Key is not a string')
  }
  if (!storage.hasOwnProperty(key)) {
    throw new Error('The key already exist!')
  }
}

module.exports = {
  put: put,
  get: get,
  update: update,
  deleteItem: deleteItem,
  clear: clear,
  save: save,
  load: load,
  callbackSave: callbackSave,
  callbackLoad: callbackLoad,
  promiseSave: promiseSave,
  promiseLoad: promiseLoad,
  all: all
}
