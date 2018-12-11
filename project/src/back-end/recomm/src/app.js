const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const l = require('./helpers/logging')

const app = express.Router()

app.post('/recomm/update', (req, res) => {
    var t0 = new Date().getTime()

    var data = req.body

    log(`My LOG - START`);
    log(data);
    log(`My LOG - END`);

    res.status(200).json({
        status: 'success',
    })

    // axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    // .then((response) => {
    //     if (!response.data.rights.isUser) {
    //         throw new Error(`${username} does not have authority`)
    //     }
    //     return dbHelpers.getRecomm(`${productID}`)
    // })
    // .then((recomm) => {
    //     res.status(200).json({
    //         status: 'success',
    //     })
    // })
    // .catch((msg) => {
    //     res.status(500).json({
    //         status: 'error',
    //         message: String(msg)
    //     })
    // })

    var t1 = new Date().getTime()
    l.serv_log("Call to update_recomm took " + (t1 - t0) + " milliseconds.")
})

app.get('/recomm/:username/:token/:productID', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var product = req.params.productID

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isUser) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.getRecomm(`${product}`)
    })
    .then((recomm) => {
        res.status(200).json({
            status: 'success',
            recomm
        })
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to get_recomm took " + (t1 - t0) + " milliseconds.")
})

module.exports = app
