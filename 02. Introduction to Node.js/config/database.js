const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '/database.json')

let getProducts = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dbPath)) {
      fs.writeFile(dbPath, '[]', (err) => {
        if (err) throw err
        return []
      })
    }
    fs.readFile(dbPath, (err, data) => {
      if (err) {
        reject(err)
      }
      return resolve(data)
    })
  })
}

let saveProducts = (products) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath, JSON.stringify(products, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err)
      }
      return resolve()
    })
  })
}

module.exports.products = {}

module.exports.products.getAll = getProducts

module.exports.products.add = (product) => {
  getProducts()
    .then((products) => {
      product.id = JSON.parse(products).length + 1
      products = JSON.parse(products)
      products.push(product)
      return products
    })
    .then((products) => {
      return saveProducts(products)
    }).catch((err) => console.log(err))
}

module.exports.products.findByName = (name) => {
  return getProducts().filter(p => p.name.toLowerCase().includes(name))
}
