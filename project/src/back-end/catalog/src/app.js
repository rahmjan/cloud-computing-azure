const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')

const app = express.Router()

app.get('/catalog', (req, res) => {

    return dbHelpers.getCatalog(`main`)
    .then((catalog) => {
        res.status(200).json({
            status: 'success',
            catalog
        })
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            msg
        })
    })
})

app.put('/catalog/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token
    var catalog = req.body.catalog

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        })
        .catch((msg) => {
            res.status(500).json({
                status: 'error',
                message: String(msg)
            })
        })

})

app.post('/catalog/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token
    var product_data = req.body

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
        .then((response) => {
            if (!response.data.rights.isAdmin) {
                throw new Error(`${username} does not have authority`)
            }
            return dbHelpers.getCatalog(`main`)
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
        })
        .catch((msg) => {
            res.status(500).json({
                status: 'error',
                message: String(msg)
            })
        })

})

app.delete('/catalog/:username/:token', (req, res) => {

    var username = req.params.username
    var token = req.params.token
    var category = req.body.category // or
    var product_id = req.body.product_id

    return axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        })
        .catch((msg) => {
            res.status(500).json({
                status: 'error',
                message: String(msg)
            })
        })

})

module.exports = app
