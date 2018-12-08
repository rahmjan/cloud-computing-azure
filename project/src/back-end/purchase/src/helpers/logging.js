const log = require('debug')('users-d')
const axios = require('axios');
const logUrl = 'http://logging:80'

function serv_log(message, jsonData) {

    var data = {}
    data._id = "purchase"
    data.message = message
    data.jsonData = jsonData

    return axios.post(`${logUrl}/log`, data)
}

module.exports = {
    serv_log
}
