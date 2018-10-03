// more about express:
// https://expressjs.com/en/starter/hello-world.html

const express = require('express')
const app = express()

const message = process.env.MSG !== '' ? process.env.MSG : 'Hello World!'

const answer = `
  <h3>Get Started Lab</h3>
  <b>Hostname:</b> ${process.env.HOSTNAME}<br/>
  <b>Your message:</b> ${message} </br>
`

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.send(answer)
})

const port = 80
app.listen(port, function () {
  console.log(`Server listening on port ${port}!`)
})
