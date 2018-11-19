# Users service

This service can register, authenticate and authorize the users. 

Port to access: `1000`  
Port to database: `1001`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /user | username=[string] & password=[string] & isUser=[bool] & isAdmin=[bool] | Authentication token | Register a new user |
| GET | /user/:username/:password | - | Authentication token | Log in a user |
| GET | /user/authorization/:username/:token | - | Rights | Get the rights of user (user, admin)|

#### Example
`SERVICE_ADDRESS=localhost`  
`TOKEN=[insert token]`

Register a new user:  
`curl -X POST -d "username=tito2&password=toti2&isUser=true&isAdmin=false" ${SERVICE_ADDRESS}:1000/user`

Log in:  
`curl -X GET ${SERVICE_ADDRESS}:1000/user/tito2/toti2`

Authorization:  
`curl -X GET ${SERVICE_ADDRESS}:1000/user/authorization/tito2/${TOKEN}`