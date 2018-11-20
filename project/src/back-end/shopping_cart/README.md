# Shopping cart service

This service can manipulate with user's shopping cart. Add or delete products.  
When it is created it will insert simple *cart* for user *admin* to the database.
Example of *cart* you can find in file `./scripts/cart.json`

Port to access: `1002`  
Port to database: `6002`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /cart/:username/:token | product_id=[string] & quantity=[string] | - | Add/Update item in the cart |
| GET | /cart/:username/:token | - | Cart | Get shopping cart |
| DELETE | /cart/:username/:token | product_id=[string] | - | Delete item in the cart |

#### Example
```
SERVICE_ADDRESS=localhost
USER_NAME=admin
PASSWORD=admin
TOKEN=$(curl -X GET ${SERVICE_ADDRESS}:1000/user/${USER_NAME}/${PASSWORD} | jq -r .token)
```

Add/Update item:  
`curl -X POST -d "product_id=8&quantity=3" ${SERVICE_ADDRESS}:1002/cart/${USER_NAME}/${TOKEN}`

Get cart:  
`curl -X GET ${SERVICE_ADDRESS}:1002/cart/${USER_NAME}/${TOKEN}`

Delete item:  
`curl -X DELETE -d "product_id=8" ${SERVICE_ADDRESS}:1002/cart/${USER_NAME}/${TOKEN}`