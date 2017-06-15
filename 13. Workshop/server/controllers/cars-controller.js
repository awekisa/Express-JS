const Car = require('../data/Car')
const Renting = require('../data/Renting')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('cars/add')
  },
  addPost: (req, res) => {
    let carReq = req.body

    // Example of validation
    if (carReq.pricePerDay <= 0) {
      res.locals.globalError = 'Price per day cannot be less than 0'
      res.render('cars/add', carReq)
      return
    }

    Car.create({
      make: carReq.make,
      model: carReq.model,
      year: carReq.year,
      pricePerDay: carReq.pricePerDay,
      power: carReq.power,
      image: carReq.image
    }).then((car) => {
      res.redirect('/cars/all')
    })
    .catch((err) => {
      let message = errorHandler.handleMongooseError(err)
      res.locals.globalError = message
      res.render('cars/add', carReq)
    })
  },
  all: (req, res) => {
    // paging 
    let pageSize = 2
    let page = parseInt(req.query.page) || 1
    let search = req.query.search
    let query = Car.find({isRented: false})
    if (search) {
      query = query.where('make').regex(new RegExp(search, 'i'))
    }


    query
      .sort('-createdOn')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(cars => {
        res.render('cars/all', {
          cars: cars,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1,
          search: search
        })
      })
  },
  rent: (req, res) => {
    let userId = req.user._id
    let carId = req.params.id
    let days = parseInt(req.body.days)

    Car.findById(carId)
      .then(car => {
        if (car.isRented) {
          res.locals.globalError = 'Car is already rented!'
          res.render('cars/all')
          return
        }

        Renting.create({
          user: userId,
          car: carId,
          days: days,
          totalPrice: car.pricePerDay * days
        })
           .then(renting => {
             car.isRented = true
             car.save()
              .then(car => {
                res.redirect('/users/me')
              })
           })
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('cars/add')
      })
  },
  editGet: (req, res) => {
    let carId = req.params.id

    Car
      .findById(carId)
      .then(car => {
        res.render('cars/edit/', {
          id: carId,
          make: car.make,
          model: car.model,
          year: car.year,
          pricePerDay: car.pricePerDay,
          power: car.power,
          image: car.image,
          isRented: car.isRented
        })
      })
  },
  editPost: (req, res) => {
    let carReq = req.body
    let carId = req.params.id

    Car
      .findById(carId)
      .then(car => {
        if (carReq.isRented === 'false') {
          Renting
            .find({})
            .populate('car')
            .where('car').equals(carId)
            .then(renting => {
              renting[0]
                .remove()
                .then(rent => {
                  car.make = carReq.make
                  car.model = carReq.model
                  car.year = carReq.year
                  car.pricePerDay = carReq.pricePerDay
                  car.power = carReq.power
                  car.image = carReq.image
                  car.isRented = false
                  car
                    .save()
                    .then(savedCar => {
                      res.render('users/adminPanel')
                    })
                    .catch(err => {
                      console.log(err)
                      res.locals.globalError = 'Failed to save car!'
                      res.render('users/adminPanel')
                    })
                })
                .catch(err => {
                  console.log(err)
                  res.locals.globalError = 'Failed to remove renting!'
                  res.render('users/adminPanel')
                })
            })
        } else {
          car.make = carReq.make
          car.model = carReq.model
          car.year = carReq.year
          car.pricePerDay = carReq.pricePerDay
          car.power = carReq.power
          car.image = carReq.image
          car
            .save()
            .then(savedCar => {
              res.render('users/adminPanel')
            })
            .catch(err => {
              console.log(err)
              res.locals.globalError = 'Failed to save car!'
              res.render('users/adminPanel')
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.locals.globalError = 'Failed to find car!'
        res.render('users/adminPanel')
      })
  }
}
