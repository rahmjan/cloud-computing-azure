const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')

const app = express.Router()

app.get('/catalog', (req, res) => {

    return dbHelpers.getCatalog(`main`)
    .then((catalog) => {
        res.status(200).json({
            status: 'success',
            catalog
        })
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            msg
        })
    })
})

module.exports = app
