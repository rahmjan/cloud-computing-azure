const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function getCart (cart) {
  return new Promise((resolve, reject) => {
      DB.get(cart, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      }
      else resolve(ok)
    })
  })
}

module.exports = {
    getCart
}
