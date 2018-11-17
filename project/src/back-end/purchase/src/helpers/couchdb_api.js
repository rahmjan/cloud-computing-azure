const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function getPurchases (username) {
  return new Promise((resolve, reject) => {
      DB.get(username, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      }
      else resolve(ok)
    })
  })
}

function insertPurchases (purchases) {
    return new Promise((resolve, reject) => {
        DB.insert(purchases, purchases._id, (ko, ok) => {
            if (ko) {
                log(ko)
                reject(ko.reason)
            }
            else resolve(ok)
        })
    })
}


module.exports = {
    getPurchases,
    insertPurchases
}
