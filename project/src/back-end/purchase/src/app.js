const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')

const app = express.Router()

app.get('/purchase/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isUser) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.getPurchases(`${username}`)
    })
    .then((purchases) => {
        res.status(200).json({
            status: 'success',
            purchases
        })
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
    })

})

app.post('/purchase/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token
    var product_data = req.body

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
        .then((response) => {
            if (!response.data.rights.isUser) {
                throw new Error(`${username} does not have authority`)
            }
            return dbHelpers.getPurchases(`${username}`)
                .catch((msg) => {
                    if (msg == `missing`)
                    {
                        var newPurch = {}
                        newPurch._id = username
                        return newPurch
                    }
                    else { throw msg }
                })
        })
        .then((purch) => {
            purch.purchases.push(product_data)
            return dbHelpers.insertPurchases(purch)
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
