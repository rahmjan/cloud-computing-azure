const bcrypt = require('bcryptjs')
const localAuth = require('./token_de_en_coders')
const log = require('debug')('users-d')

const usersDB = require('nano')(process.env.DB_URL)

function createUser (req) {
  var username = req.body.username
  var password = req.body.password
  var isUser = req.body.isUser
  var isAdmin = req.body.isAdmin
  log('createUser()')
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(password, salt)
  return new Promise((resolve, reject) => {
    usersDB.insert({ password: hash, isUser: isUser, isAdmin:isAdmin }, username, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      } else resolve(username)
    })
  })
}

function getUser (username) {
  return new Promise((resolve, reject) => {
    usersDB.get(username, (ko, ok) => {
      if (ko) {
        log(ko)
        reject(ko.reason)
      } else resolve({ id: ok._id, password: ok.password })
    })
  })
}

function comparePass (userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword)
}

function ensureAuthenticated (req) {
  return new Promise((resolve, reject) => {
    var token = req.params.token
    if (!token) {
      log('user request has no token')
      reject(new Error(`No token for user ${req.params.username}`))
    }
    localAuth.decodeToken(token, (err, payload) => {
      if (err) {
        log('token has expired')
        reject(new Error(`Token for ${req.params.username} has expired`))
      }
      usersDB.get(parseInt(payload.sub, 10), (ko, ok) => {
        if (ko) {
          log(ko)
          reject(ko.reason)
        } else resolve()
      })
    })
  })
}

module.exports = {
  createUser,
  getUser,
  comparePass,
  ensureAuthenticated
}
