const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const d = require('./helpers/date_format')

const app = express.Router()

app.post('/log', (req, res) => {

    var myDate = d.dateFormat('yyyy-mm-dd_HH:MM:ss:L')

    var logVar = {}
    logVar._id = req.body._id + `_` + myDate
    logVar.date = myDate
    logVar.service = req.body._id
    logVar.message = req.body.message
    logVar.jsonData = req.body.jsonData

    return dbHelpers.insertLog(logVar)
    .then(() => {
            res.status(200).json({
            status: 'success'
        })
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
    })

})

module.exports = app
