const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const authHelpers = require('./helpers/couchdb_api')
const localAuth = require('./helpers/token_de_en_coders')

const app = express.Router()

app.get('', (req, res) => {

    log(`Test of catalog`)
    log(`Test of catalog`)
    log(`Test of catalog`)
    log(`Test of catalog`)
    log(`Test of catalog`)

    axios.get(`${authUrl}/user/tito/toti`)
        .then((token) => {
            res.status(200).json({
                status: 'success - catalog',
            })
        })
        .catch((msg) => {
            res.status(500).json({
                status: 'error - catalog',
                message: msg
            })
        })

    // res.status(200).json({
    //     status: '!!!!! success - catalog'
    // })
})

app.get('/catalog', (req, res) => {

  log(`Test of catalog`)
  log(`Test of catalog`)
  log(`Test of catalog`)
  log(`Test of catalog`)
  log(`Test of catalog`)

  res.status(200).json({
      status: 'TEST was success'
  })
})

module.exports = app
