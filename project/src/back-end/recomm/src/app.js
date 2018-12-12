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
        dbHelpers.getRecomm(key)
        .then((response) => {
            return response
        })
        .catch((msg) => {
            if (msg == `missing`)
            {
                log(`MISSING: `+ key)
                return database[key];
            }
            else { throw msg }
        })
        .then((response) => {
            log(`HERE`)
            log(response)

            // if (response._rev != null)
            // {
            //     database[key]._rev = response._rev;
            // }
            //
            // response = database[key];
            log(response)
            log(`HERE-END`)
            dbHelpers.insertRecomm(response)
            .catch((msg) => {
                log(`ERROR: `)
                log(`ERROR:`+ String(msg))
            })
        })
    }

    res.status(200).json({
        status: 'success',
    })

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
