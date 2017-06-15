db.getCollection('cars').update({}, { $set: { isRented: false } }, {multi: true})
db.getCollection('cars').update({}, { $set: { isRented: false } }, {multi: true})
db.getCollection('rents').update({}, { $set: { rentedOn: Date.now() } }, {multi: true})
