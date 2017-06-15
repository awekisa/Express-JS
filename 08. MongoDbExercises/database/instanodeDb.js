const url = require('url')
const Tag = require('../models/Tag')
const Image = require('../models/Image')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')

module.exports.saveImage = (image) => {
  return new Promise((resolve, reject) => {
    Image.create(image).then((newImage) => {
      let tagPromises = []
      for (let tagId of image.tags) {
        let tagUpdPromise = Tag.findById(tagId).then(tag => {
          tag.images.push(newImage._id.toString())
          tag.save(tag).catch((err) => {
            console.log(err)
          })
        })
        tagPromises.push(tagUpdPromise)
      }

      Promise.all(tagPromises).then(() => {
        resolve(console.log(newImage))
      })
    })
  })
}

module.exports.saveTag = (tagName) => {
  return new Promise((resolve, reject) => {
    Tag.findOne({name: tagName}).then(tag => {
      if (tag) {
        resolve(tag._id)
        return
      }
      Tag.create({name: tagName}).then((tag) => {
        resolve(tag._id)
      })
    })
  })
}

module.exports.showDates = (formData) => {
  return new Promise((resolve, reject) => {
    if (formData.after !== '' && formData.before !== '') {
      showImagesBetweenDates(formData.after, formData.before, formData.show).then((images) => {
        resolve(images)
      })
    } else if (formData.before !== '') {
      showImagesBeforeDate(formData.before, formData.show).then((images) => {
        resolve(images)
      })
    } else if (formData.after !== '') {
      showImagesAfterDate(formData.after, formData.show).then((images) => {
        resolve(images)
      })
    }
  })
}

function showImagesBetweenDates (after, before, showNumber) {
  return new Promise((resolve, reject) => {
    Image.find({})
      .where('date').gt(new Date(after))
      .where('date').lt(new Date(before))
      .limit(parseInt(showNumber) || 10)
      .then((filteredImages) => {
        resolve(filteredImages)
      })
  })
}

function showImagesAfterDate(date, showNumber) {
  return new Promise((resolve, reject) => {
    Image.find({})
      .where('date').gt(new Date(date))
      .limit(parseInt(showNumber) || 10)
      .then((filteredImages) => {
        resolve(filteredImages)
      })
  })
}

function showImagesBeforeDate(date, showNumber) {
  return new Promise((resolve, reject) => {
    Image.find({})
      .where('date').lt(new Date(date))
      .limit(parseInt(showNumber) || 10)
      .then((filteredImages) => {
        resolve(filteredImages)
      })
  })
}
