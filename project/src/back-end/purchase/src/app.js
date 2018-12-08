const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const l = require('./helpers/logging')

const app = express.Router()

app.get('/purchase/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        l.serv_log(`Get purchases: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Get purchases: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to get_purchases took " + (t1 - t0) + " milliseconds.")
})

app.post('/purchase/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var product_data = req.body

    l.serv_log(`Add purchase: ${username} - items: ${product_data}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        l.serv_log(`Add purchase: ${username} - successful`, product_data)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Add purchase: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to add_purchase took " + (t1 - t0) + " milliseconds.")
})

module.exports = app
