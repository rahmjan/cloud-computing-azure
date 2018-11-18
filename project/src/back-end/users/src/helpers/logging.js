const axios = require('axios');
const logUrl = 'http://logging:80'

function serv_log(message) {

    var data = {}
    data._id = `users`
    data.event = message

    return axios.post(`${logUrl}/log`, data)
}

module.exports = {
    serv_log
}
