const express = require('express')
const log = require('debug')('users-d')

const authHelpers = require('./helpers/couchdb_api')
const localAuth = require('./helpers/token_de_en_coders')

const app = express.Router()

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
