# Recommendation service

Service for recommendation engine. 
When it is created it will insert simple *recomm* and it will send queries (`./scripts/views/queries`) to logging database.
Example of *recomm* you can find in file `./scripts/recomms.json`. It is data from logging service which went through queries of recommendation service. File is in "productID: quantity" format.

Port to access: `1005`  
Port to database: `6005`

The service periodically (every 60 seconds in `./scripts/recomm_service.sh`) update it's database of best sell products.
It provides suggestions (tree best product) based on previous purchases of all users, exclude products in user's shopping cart and employs a Map/Reduce periodic query.

The Map/Reduce query, first it get the data from logging database. The data are `{[productID, PdoductID], quantity}` where the second `productID` is product which was bought together with the first `productID` in `quantity`.
Second, on this data we use simple reduce `sum(vals)`.
Third, data are send with POST message to `/recomm/update` where there are parsed and inserted to database.


#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /recomm/update | Data in JSON format from queries | - | Update recomm. database |
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
