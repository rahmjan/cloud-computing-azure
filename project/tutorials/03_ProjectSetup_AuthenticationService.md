# :books: LINGI2145 Project: Authentication Service

This tutorial guides you through the design of an authentication service (AuthS for short) and its integration with the SCApp.

This microservice exposes a REST API over HTTP.
It stores users authentication information in a persistent manner, and offers the following endpoints:

| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /user | username=[string] & password=[string] | Authentication token | Register a new user |
| GET | /user/:username/:password | - | Authentication token | Log in a user |

We show how to deploy this microservice using Docker containers and link it from the front-end.

:warning: This tutorial demands you to complete some tasks, based on what  you have learnt in the previous tutorials.
These tasks are tagged with the symbol: :pencil2:

# Build & Deploy
AuthS consists of a database and an HTTP server written in node.js.
Both components run in separate Docker containers.

:pencil2: **Create a Docker network.**
We use this network to attach the containers.

AuthS is delivered with two Dockerfiles located in the directories `../src/back-end/users` and `../src/back-end/users/src/db`.
The former refers to the users database and the latter to the server, which answers REST calls over HTTP.
The source code is organized as follows:

```
users
├── Dockerfile    << descriptor of AuthS daemon
├── gulpfile.js   << run task of development
├── package.json
├── scripts       << bash scripts to control AuthS behavior
│   └── run-usersd.sh
└── src           
    ├── app.js    << REST API of authentication service
    ├── daemon.js << initialize an HTTP server (AuthS entry-point)
    ├── db
    │   ├── Dockerfile  << descriptor of AuthS database
    │   └── local.ini   << credentials of CouchDB administrator
    └── helpers
        ├── couchdb_api.js
        └── token_de_en_coders.js
```

:pencil2: **Create a Docker network & build images.** Build the Docker images that AuthS requires using the appropriate command.

:pencil2: **Run containers**. Create an instance of both containers by following these instructions (respect the order of tasks):

1. `docker run --network [DOCKER_NETWORK_NAME] --name users-db -p 5984:5984 -d [DOCKER_IMAGE_NAME_OF_USERS-DB]`

1. `docker run --network [DOCKER_NETWORK_NAME] -p 3000:80 --name users-d -d [DOCKER_IMAGE_NAME_OF_USERS-D]`

The container you run in step 2 expose the port `3000`, you have now an AuthS daemon listening on that port.

# Test AuthS with `curl`

Now, you are ready to test your first microservice using `curl`.
Follow the following tasks and answer the questions:

1. **Users registration**. Create a new user (new resource) using the interface `POST /user` as follows: `curl -X POST --data "username=tito&password=toti" localhost:3000/user`.
Look at the logs of AuthS:
  - *What do you receive as an answer?*
  - *What is the meaning of the HTTP status code 200?*
  - You receive an authentication token within the answer of this call.
  *What do you think is the purpose of this token?*

1. **Users authentication**. `GET /user/:username/:password` authenticates the resource identified by `:username`, test this call with the credentials of one user **without a registration** as follows: `curl -X GET localhost:3000/user/bob/bobi`
  - *What happens?*
  - *What is the meaning of the status code 500?*
  - Log in with the credentials of user `tito` with `curl -X GET  localhost:3000/user/tito/toti`
- *What happens now?*
- *What is the propose of having a new authentication token?*

# Source code

It is important to understand how AuthS is built in order to give you a starting point for creating new microservices.

AuthS is a Node.js server built with [express](https://github.com/expressjs/express), a web framework to create HTTP servers.
The initial configuration of this server is in the file `project/back-end/users/src/daemon.js`.
The following shows an extract:

```javascript
/* [...] */
// the REST API that AuthS expose is within the file app.js
const app = require('./app');
/* [...] */
// launch an exception when a request is not part of the REST API
server.use((req, res, next) => {
  const err = new Error('Not Found')
  /* [...] */  
})
// OR we respond with the status code 500 if an error occurs
server.use((err, req, res, next) => {
  /* [...] */  
  res.status(err.status || 500)
  res.json({
    status: 'error',
    message: err
  })
})
// daemon is now listening on port 80
const port = 80
server.listen(port, function () {
  log(`Listening at port ${port}`)
})
```

The concrete implementation of each REST operation in AuthS is in file [`../src/back-end/users/src/app.js`](../src/back-end/users/src/app.js).

Here, we just present an overview of the implementation of the call that registers new users via the interface `POST /user`.
All other calls follow a similar structure.

``` javascript
/* [...] */
app.post('/user', (req, res) => {
// try to create a new user with req.username and req.password
  return authHelpers.createUser(req, res)
  /* [...] */
  .then((token) => {
	// successful creation of an authentication token
    res.status(200).json({
      status: 'success',
      token,
    });
  })
  .catch(() => {
	// either the creation of the authentication token failed
	// or the user was already registered in the database
    res.status(500).json({
      status: 'error',
    });
  });
```

In the previous snippet, you may have noticed that function calls are chained.
AuthS uses [Javascript Promises](https://scotch.io/tutorials/javascript-promises-for-dummies) to guarantee order in asynchronous calls.
A REST call in our microservice succeeds if every operations in the chain of function succeeds.

# Call AuthS from the front-end application

This section explains how to consume the REST API of AuthS from the provided front-end.
Open the file [`../src/front-end/src/interfaces/AuthenticationService.jsx`](../src/front-end/src/interfaces/AuthenticationService.jsx).
This is the source code that mimics an authentication service.

:pencil2: Replace the whole content of the file with this content.
It is important to read and understand the content and principles of this code.
Use online resources if necessary to make sure you have a clear vision of how the code works: you will need to be able to write similar code for your own services.

``` javascript
import axios from 'axios' // we use this library as HTTP client
// you can overwrite the URI of the authentication micro-service
// with this environment variable
const url = process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3000'

class AuthenticationService {
    // setters
    setHandlers (onSucc, setAuthStatus, changeRoute) {
        this.onSucc = onSucc
        this.setAuthStatus = setAuthStatus
        this.changeRoute = changeRoute
    }
    // POST /user
    // ${data} is a JSON object with the fields
    // username=[string] and [password]. These fields
    // matches the specification of the POST call
    registerUser (data, onErr) {
        window.localStorage.setItem('username', JSON.stringify(data.username))
        axios.post(`${url}/user`, data)
            .then((res) => {
                // we keep the authentication token
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(`Successful registration of user [${data.username}]!`)
                this.changeRoute('/')
            })
            .catch((error) => {
                console.error(error.message)
                var msg = `Registration of user [${data.username}] failed.`
                onErr(`${msg} Error: ${error.msg}`)
            })
    }
    // GET /user/:username
    loginUser (data, onErr) {
        window.localStorage.setItem('username', JSON.stringify(data.username))
        axios.get(`${url}/user/${data.username}/${data.password}`)
            .then((res) => {
                window.localStorage.setItem('authToken', JSON.stringify(res.data.token))
                this.setAuthStatus(true)
                this.onSucc(`Welcome back [${data.username}]!`)
                this.changeRoute('/')
            })
            .catch((error) => {
                console.error(error.message)
                onErr(`User [${data.username}] is not registered or his credentials are incorrect.`)
            })
    }
}

export default AuthenticationService
```

Go back to `../src/front-end/` and use `npm start` to launch the front-end.
Through the web interface, register a new user, log off and log in again.
You will notice that now users credentials are persistent.
Confirm that AuthS receive calls to its API by consulting its logs.

:checkered_flag: **We finish this tutorial.**
You have now an overview of the development of a web application.
Refer to the [deliverables section](../README.md#deliverable) of the project description for more details about your future assignments.
