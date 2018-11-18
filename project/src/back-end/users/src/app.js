const express = require('express')
const log = require('debug')('users-d')

const authHelpers = require('./helpers/couchdb_api')
const localAuth = require('./helpers/token_de_en_coders')
const l = require('./helpers/logging')

const app = express.Router()

app.post('/user', (req, res) => {
  var t0 = new Date().getTime()

  var username = req.body.username
  var password = req.body.password

  l.serv_log(`Register user: ${username}`)
  log(`try to add user :: username=${username}&password=${password}`)

  authHelpers.createUser(req)
    .then((user) => { return localAuth.encodeToken(user[0]) })
    .then((token) => {
      res.status(200).json({
        status: 'success',
        token
      })
      l.serv_log(`Register user: ${username} - successful`)
    })
    .catch((msg) => {
      res.status(500).json({
        status: 'error',
        message: msg
      })
      l.serv_log(`Register user: ${username} - error: ${msg}`)
    })

  var t1 = new Date().getTime()
  l.serv_log("Call to register_user took " + (t1 - t0) + " milliseconds.")
})

app.get('/user/:username/:password', (req, res) => {
  var t0 = new Date().getTime()

  var username = req.params.username
  var password = req.params.password

  log(`try to log in: username=${username} & password=${password}`)

  authHelpers.getUser(username)
    .then((response) => {
      if (!response) {
        l.serv_log(`Login: ${username} is not in DB`)
        throw new Error(`${username} is not in DB`)
      }
      log(response)
      if (response && !authHelpers.comparePass(password, response.password)) {
        l.serv_log(`Login: Incorrect password for ${username}`)
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
      l.serv_log(`Login: ${username} - successful`)
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: String(err)
      })
      l.serv_log(`Login: ${username} - error: ${msg}`)
    })

  var t1 = new Date().getTime()
  l.serv_log("Call to login_user took " + (t1 - t0) + " milliseconds.")
})

app.get('/user/authorization/:username/:token', (req, res) => {
  var t0 = new Date().getTime()

  var username = req.params.username
  log(`checks wether the token of ${username} is valid`)

  authHelpers.ensureAuthenticated(req)
    .then(() => {
      return authHelpers.getRights(username)
      })
    .then((rights) => {
      res.status(200).json({
        status: 'success',
        rights
      })
      l.serv_log(`Authorization: ${username} - successful`)
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        message: String(err)
      })
      l.serv_log(`Authorization: ${username} - error: ${String(err)}`)
    })

  var t1 = new Date().getTime()
  l.serv_log("Call to authorization_user took " + (t1 - t0) + " milliseconds.")
})

module.exports = app
