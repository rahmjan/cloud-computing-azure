# Purchase service

This service can make purchase and store the history of purchases. 
When it is created it will insert simple *purchases* for user *admin* to the database.
Example of *purchases* you can find in file `./scripts/purchases.json`

Port to access: `1003`  
Port to database: `6003`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /purchase/:username/:token | product_data | - | Add purchase |
| GET | /purchase/:username/:token | - | Purchases | Get history of purchases |

#### Example
```
SERVICE_ADDRESS=localhost
USER_NAME=admin
PASSWORD=admin
TOKEN=$(curl -X GET ${SERVICE_ADDRESS}:1000/user/${USER_NAME}/${PASSWORD} | jq -r .token)
product_data=$(cat ./tests/test_post.json)
WHAT='Content-Type: application/json'
```

Add purchase:  
`curl -X POST -d "${product_data}" -H "${WHAT}" ${SERVICE_ADDRESS}:1003/purchase/${USER_NAME}/${TOKEN}`

Get purchases:  
`curl -X GET ${SERVICE_ADDRESS}:1003/purchase/${USER_NAME}/${TOKEN}`
