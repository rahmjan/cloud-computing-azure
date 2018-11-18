const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const l = require('./helpers/logging')

const app = express.Router()

app.get('/catalog', (req, res) => {
    var t0 = new Date().getTime()

    dbHelpers.getCatalog(`main`)
    .then((catalog) => {
        res.status(200).json({
            status: 'success',
            catalog
        })
        l.serv_log(`Get catalog - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            msg
        })
        l.serv_log(`Get catalog - error: ${msg}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to get_catalog took " + (t1 - t0) + " milliseconds.")
})

app.put('/catalog/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var catalog = req.body.catalog

    l.serv_log(`Put catalog: ${username} - new catalog: ${catalog}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isAdmin) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.insertCatalog(catalog)
    })
    .then(() => {
        res.status(200).json({
            status: 'success'
        })
        l.serv_log(`Put catalog: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Put catalog: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to put_catalog took " + (t1 - t0) + " milliseconds.")
})

app.post('/catalog/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var product_data = req.body

    l.serv_log(`Update catalog: ${username} - update: ${product_data}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isAdmin) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.getCatalog(`main`)
            .catch((msg) => {
                if (msg == `missing`)
                {
                    var newCat = {}
                    newCat._id = `main`
                    return newCat
                }
                else { throw msg }
            })
    })
    .then((cart) => {
        for(var key in product_data)
        {
            cart[key] = product_data[key];
        }
        return dbHelpers.insertCatalog(cart)
    })
    .then(() => {
        res.status(200).json({
            status: 'success'
        })
        l.serv_log(`Update catalog: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Update catalog: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to update_catalog took " + (t1 - t0) + " milliseconds.")
})

app.delete('/catalog/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var category = req.body.category // or
    var product_id = req.body.product_id

    l.serv_log(`Delete item in catalog: ${username} - id of item: ${product_id}, ${category}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isAdmin) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.getCatalog(`main`)
    })
    .then((cat) => {
        var keys = Object.keys(cat)
        for(var k in keys){
            if (cat[keys[k]].hasOwnProperty(product_id))
            {
                delete cat[keys[k]][product_id]
            }
        }

        delete cat[category]
        return dbHelpers.insertCatalog(cat)
    })
    .then(() => {
        res.status(200).json({
            status: 'success'
        })
        l.serv_log(`Delete item in catalog: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Delete item in catalog: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to delete_catalog took " + (t1 - t0) + " milliseconds.")
})

module.exports = app
