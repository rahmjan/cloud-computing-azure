const log = require('debug')('users-d')

const usersDB = require('nano')(process.env.DB_URL)

function getCatalog (catalog) {
  return new Promise((resolve, reject) => {
    usersDB.get(catalog, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      }
      else resolve(ok)
    })
  })
}

module.exports = {
  getCatalog
}
