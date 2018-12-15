# Recommendation service

Service for recommendation engine. 
When it is created it will insert simple *recomm*. It is data from logging service which went through queries of recommendation service.
Example of *recomm* you can find in file `./scripts/recomms.json`. File is in "productID: quantity" format.

Port to access: `1005`  
Port to database: `6005`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /recomm/update | to do... | - |  |
| GET | /recomm/:username/:token/:productID | - | Tree best product which you can buy together  | Get recommendation for product |

#### Example
```
SERVICE_ADDRESS=localhost
USER_NAME=admin
PASSWORD=admin
TOKEN=$(curl -X GET ${SERVICE_ADDRESS}:1000/user/${USER_NAME}/${PASSWORD} | jq -r .token)
```

Get recommendation for product with ID 8:  
`curl -X GET ${SERVICE_ADDRESS}:1005/recomm/${USER_NAME}/${TOKEN}/8`
