const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const l = require('./helpers/logging')

const app = express.Router()

app.post('/recomm/update', (req, res) => {
    var t0 = new Date().getTime()

    var data_arr = req.body.rows;
    var database = {};

    for (var i = 0; i < data_arr.length; ++i)
    {
        var product = data_arr[i].key[0];
        var refProduct = data_arr[i].key[1];
        var quantity = data_arr[i].value;

        if ( database[`${product}`] == null )
        {
            database[`${product}`] = {};
            database[`${product}`][`_id`] = product;
        }
        database[`${product}`][`${refProduct}`] = quantity;
    }

    for(var key in database)
    {
        axios.post(`http://recomm:80/recomm/update2`, database[key])
    }

    res.status(200).json({
        status: 'success',
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to update_recomm took " + (t1 - t0) + " milliseconds.")
})

app.post('/recomm/update2', (req, res) => {
    var data = req.body

    dbHelpers.getRecomm(`${data._id}`)
    .then((response) => {
        return response
    })
    .catch((msg) => {
        if (msg == `missing`)
        {
            return data;
        }
        else { throw msg }
    })
    .then((response) => {
        if (response._rev != null)
        {
            data._rev = response._rev;
            response = data;
        }

        dbHelpers.insertRecomm(response)
    })
    .then((response) => {
        res.status(200).json({
            status: 'success',
        })
    })
    .catch((msg) => {
        log(`ERROR: `+ msg)
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
    })
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
