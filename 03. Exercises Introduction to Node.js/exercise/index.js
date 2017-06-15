let storage = require('./storage')

storage.put('key', 'value')
storage.put('key2', 'value2')
storage.put('key3', 'value3')

// test get
console.log(storage.get('key2'))
// test update
storage.update('key', 'value1')
console.log(storage.all())
// test delete
storage.deleteItem('key3')
console.log(storage.all())
// test clear
storage.clear()
console.log(storage.all())

// // test save function
storage.put('key', 'value')
storage.put('key2', 'value2')
storage.put('key3', 'value3')

// storage.save()

// // test load function

// storage.clear()
// storage.load()
// console.log(storage.all())

// // test callback save and callback load

// storage.put('key4', 'value4')
// storage.callbackSave(() => {
//   storage.clear()
//   storage.callbackLoad(() => {
//     console.log(storage.all())
//   })
// })

// test promise load


storage
  .promiseSave()
  .then(() => {
    storage.clear()
    storage
      .promiseLoad()
      .then(() => {
        console.log(storage.all())
      })
  })






