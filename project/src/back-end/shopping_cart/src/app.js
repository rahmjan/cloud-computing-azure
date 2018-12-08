const axios = require('axios');
const authUrl = 'http://users-daemon:80'

const express = require('express')
const log = require('debug')('users-d')

const dbHelpers = require('./helpers/couchdb_api')
const l = require('./helpers/logging')

const app = express.Router()

app.get('/cart/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
    .then((response) => {
        if (!response.data.rights.isUser) {
            throw new Error(`${username} does not have authority`)
        }
        return dbHelpers.getCart(`${username}`)
    })
    .then((cart) => {
        res.status(200).json({
            status: 'success',
            cart
        })
        l.serv_log(`Get cart: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Get cart: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to get_cart took " + (t1 - t0) + " milliseconds.")
})

app.post('/cart/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var product_id = req.body.product_id
    var quantity = parseInt(req.body.quantity)

    l.serv_log(`Add item to cart: ${username} - item: ${product_id}, quantity: ${quantity}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        var element = {}
        element.quantity = quantity
        cart[product_id] = element
        return dbHelpers.insertCart(cart)
    })
    .then(() => {
            res.status(200).json({
            status: 'success'
        })
        l.serv_log(`Add item to cart: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Add item to cart: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to add_item_cart took " + (t1 - t0) + " milliseconds.")
})

app.delete('/cart/:username/:token', (req, res) => {
    var t0 = new Date().getTime()

    var username = req.params.username
    var token = req.params.token
    var product_id = parseInt(req.body.product_id)

    l.serv_log(`Delete item in cart: ${username} - item: ${product_id}`)

    axios.get(`${authUrl}/user/authorization/${username}/${token}`)
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
        l.serv_log(`Delete item in cart: ${username} - successful`)
    })
    .catch((msg) => {
        res.status(500).json({
            status: 'error',
            message: String(msg)
        })
        l.serv_log(`Delete item in cart: ${username} - error: ${String(msg)}`)
    })

    var t1 = new Date().getTime()
    l.serv_log("Call to delete_item_cart took " + (t1 - t0) + " milliseconds.")
})

module.exports = app
