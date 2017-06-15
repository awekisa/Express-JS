db.getCollection('threads').update({}, {$set: {'lastAnswer': Date.now()}}, {multi: true})
