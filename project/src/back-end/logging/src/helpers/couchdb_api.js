const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function insertLog (log) {
    return new Promise((resolve, reject) => {
        DB.insert(log, log._id, (ko, ok) => {
            if (ko) {
                log(ko)
                reject(ko.reason)
            }
            else resolve(ok)
        })
    })
}


module.exports = {
    insertLog
}
