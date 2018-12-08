const log = require('debug')('users-d')

const DB = require('nano')(process.env.DB_URL)

function insertLog (inLog) {
    return new Promise((resolve, reject) => {
        DB.insert(inLog, inLog._id, (ko, ok) => {
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
