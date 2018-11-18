const express = require('express')
const log = require('debug')('users-d')

const authHelpers = require('./helpers/couchdb_api')
const localAuth = require('./helpers/token_de_en_coders')
const l = require('./helpers/logging')

const app = express.Router()

app.post('/user', (req, res) => {
  var username = req.body.username
  var password = req.body.password
  log(`try to add user :: username=${username}&password=${password}`)
  return authHelpers.createUser(req)
    .then((user) => { return localAuth.encodeToken(user[0]) })
    .then((token) => {
      res.status(200).json({
        status: 'success',
        token
      })
    })
    .catch((msg) => {
      res.status(500).json({
        status: 'error',
        message: msg
      })
    })
})

app.get('/user/:username/:password', (req, res) => {
  var username = req.params.username
  var password = req.params.password
  log(`try to log in: username=${username} & password=${password}`)
  return authHelpers.getUser(username)
    .then((response) => {
      if (!response) {
        throw new Error(`${username} is not in DB`)
      }
      log(response)
      if (response && !authHelpers.comparePass(password, response.password)) {
        throw new Error(`Incorrect password for ${username} is not in DB`)
      }
      return response
    })
    .then((response) => { return localAuth.encodeToken(response) })
    .then((token) => {
      res.status(200).json({
        status: 'success',
        token
      })
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: String(err)
      })
    })
})

app.get('/user/authorization/:username/:token', (req, res) => {
  var username = req.params.username
  log(`checks wether the token of ${username} is valid`)
  return authHelpers.ensureAuthenticated(req)
    .then(() => {
      return authHelpers.getRights(username)
      })
    .then((rights) => {
      res.status(200).json({
        status: 'success',
        rights
      })
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: String(err)
      })
    })
})

module.exports = app
