const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')

const app = express.Router()

app.post('/log', (req, res) => {

    var log = {}
    log._id = req.body.id
    log.event = req.body.event

    return dbHelpers.insertLog(log)
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

app.delete('/cart/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token
    var product_id = parseInt(req.body.product_id)

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
        .then((response) => {
            if (!response.data.rights.isUser) {
                throw new Error(`${username} does not have authority`)
            }
            return dbHelpers.getCart(`${username}`)
                .catch((msg) => {
                    if (msg == `missing`)
                    {
                        var newCar = {}
                        newCar._id = username
                        return newCar
                    }
                    else { throw msg }
                })
        })
        .then((cart) => {
            delete cart[product_id]
            return dbHelpers.insertCart(cart)
        })
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
