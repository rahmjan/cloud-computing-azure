# Logging service

This service stores logs from other services.  
When it is created it will insert simple *logs* to the database.
Example of *logs* you can find in file `./scripts/logs.json`

Port to access: `1004`  
Port to database: `6004`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /log | _id=[string] & event=[string] | - | Send log |


#### Example
```
SERVICE_ADDRESS=localhost
```

Send log:  
`curl -X POST -d "_id=Who_send_it&event=What_happened" ${SERVICE_ADDRESS}:1004/log`

#### List of logged items
- Performance measurements - How long it take to answer a request.
- Who is calling the service.
- If call was successful or not.
- What user is doing.
