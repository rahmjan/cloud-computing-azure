#!/usr/bin/env bash

### Start with authentication services ##
#docker stop $(docker ps -aq)
#docker rm $(docker ps -aq)
#
#NETWORK=docker-network
#IMAGE_USERS=image-auth
#IMAGE_USERS_DB=image-auth-db
#SERVICE_USER=users
#SERVICE_USER_DB=users-db
#
## Create network
#docker network create ${NETWORK}
#
## Build images
#docker build -t ${IMAGE_USERS} ./users/
#docker build -t ${IMAGE_USERS_DB} ./users/src/db/
#
## Run
#docker run --network ${NETWORK} -p 3000:80 --name ${SERVICE_USER} -d ${IMAGE_USERS}
#docker run --network ${NETWORK} --name ${SERVICE_USER_DB} -p 5984:5984 -d ${IMAGE_USERS_DB}

USER_NAME=admin
ADMIN_PASS=Admin1234
GITHUB_ACC=rahmjan
DNS_NAME=(main auth)

# Please login
az login

# Create VM
for dns_name in "${DNS_NAME[@]}"
do
    az group deployment create --resource-group lingi2145.fr \
                               --template-file ./azure-docker-vm.json \
                               --parameters "{\"adminUsername\": {\"value\": \"${USER_NAME}\"},
                                              \"adminPassword\": {\"value\": \"${ADMIN_PASS}\"},
                                              \"gitHubAccount\": {\"value\": \"${GITHUB_ACC}\"},
                                              \"dnsNameForPublicIP\": {\"value\": \"${dns_name}\"}}"
done

# Do something else...

