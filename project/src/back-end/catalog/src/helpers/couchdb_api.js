const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function getCatalog (catalog) {
  return new Promise((resolve, reject) => {
      DB.get(catalog, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      }
      else resolve(ok)
    })
  })
}

function insertCatalog (catal) {
    return new Promise((resolve, reject) => {
        DB.insert(catal, catal._id, (ko, ok) => {
            if (ko) {
                log(ko)
                reject(ko.reason)
            }
            else resolve(ok)
        })
    })
}

module.exports = {
    getCatalog,
    insertCatalog
}
